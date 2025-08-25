pipeline {
    agent any
    options { disableConcurrentBuilds(); timestamps() }

    parameters {
        booleanParam(name: 'RUN_SONAR',     defaultValue: true,  description: 'Run SonarQube analysis')
        booleanParam(name: 'RUN_TRIVY',     defaultValue: true,  description: 'Scan image with Trivy')
        booleanParam(name: 'DEPLOY_COMPOSE',defaultValue: true,  description: 'Deploy using docker compose (manifest repo)')
        booleanParam(name: 'DEPLOY_K8S',    defaultValue: true, description: 'Deploy to Kubernetes using Helm chart')
        booleanParam(name: 'INSTALL_MON',   defaultValue: false, description: 'Install/Upgrade Prometheus & Grafana via Helm')
    }

    environment {
        REGISTRY   = "ankitv1504"
        IMAGE      = "todo-server"
        SONARQUBE_SERVER = "SonarQubeServer"
        SONAR_SCANNER    = "SonarScanner"
        SONAR_PROJECTKEY = "todo-server"
        SONAR_PROJNAME   = "todo-server"
        SONAR_PROJVER    = "${env.BUILD_NUMBER}"
        TRIVY_SEVERITY   = "HIGH,CRITICAL"
        MANIFEST_REPO_URL = "https://github.com/ankitv1504/TaskManage-ci-cd-menifest.git"
        MANIFEST_BRANCH   = "main"
        MANIFEST_CRED_ID  = "github"
        ARGO_SERVER   = "argocd.example.com"
        ARGO_APP      = "todo-app"
        ARGO_REPO_URL = "https://github.com/ankitv1504/TaskManage-ci-cd-menifest.git"
        ARGO_REPO_PATH= "k8s"
        ARGO_DEST_SRV = "https://kubernetes.default.svc"
        ARGO_DEST_NS  = "default"
        SLACK_CHANNEL = "#ci-cd"
    }

    tools {
        nodejs 'NodeJS 18'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Compute Image Tag') {
            steps {
                script {
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${shortCommit}"
                    echo "IMAGE: ${env.REGISTRY}/${env.IMAGE}:${env.IMAGE_TAG}"
                }
            }
        }

        stage('Install & Build') {
            steps {
                dir('todo-src') {
                    sh 'npm install'
                    sh 'npm run build || echo "no build step"'
                }
            }
        }

        stage('Test') {
            steps {
                dir('todo-src') {
                    sh 'npm test || echo "no tests"'
                }
            }
        }

        stage('SonarQube Analysis') {
            when { expression { return params.RUN_SONAR } }
            steps {
                dir('todo-src') {
                  withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        script {
                            def scannerHome = tool "${SONAR_SCANNER}"
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                  -Dsonar.projectKey=${SONAR_PROJECTKEY} \
                                  -Dsonar.projectName=${SONAR_PROJNAME} \
                                  -Dsonar.projectVersion=${SONAR_PROJVER} \
                                  -Dsonar.sources=./src,./views,./server.js,./app.js \
                                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                  -Dsonar.exclusions=node_modules/**,public/**
                            """
                        }
                    }
                  }
                }
            }
        }

        stage('Quality Gate') {
            when { expression { return params.RUN_SONAR } }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Image') {
            steps {
                dir('todo-src') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                        sh 'echo $DH_PASS | docker login -u $DH_USER --password-stdin'
                    }
                    sh 'docker build -t $REGISTRY/$IMAGE:$IMAGE_TAG .'
                    sh 'docker push $REGISTRY/$IMAGE:$IMAGE_TAG'
                    sh 'docker tag $REGISTRY/$IMAGE:$IMAGE_TAG $REGISTRY/$IMAGE:latest || true'
                    sh 'docker push $REGISTRY/$IMAGE:latest || true'
                }
            }
        }

        stage('Trivy Image Scan') {
            when { expression { return params.RUN_TRIVY } }
            steps {
                dir('todo-src') {
                    script {
                        sh """
                          trivy image --format json \
                            --severity ${TRIVY_SEVERITY} \
                            --exit-code 1 \
                          $REGISTRY/$IMAGE:$IMAGE_TAG > todo-src/trivy_report.json
                        """
                        sh 'cat todo-src/trivy_report.json'
                    }
                }
            }
        }

        stage('Update Manifest & Deploy (Compose)') {
            when { expression { return params.DEPLOY_COMPOSE } }
            steps {
                dir('manifest') {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${MANIFEST_BRANCH}"]], 
                        userRemoteConfigs: [[url: "${MANIFEST_REPO_URL}", credentialsId: "${MANIFEST_CRED_ID}"]]
                    ])
                    sh '''
                        set -e
                        yml="docker-compose.yml"
                        test -f "$yml" || (echo "docker-compose.yml missing"; exit 1)
                        sed -i "s|^\\s*image:.*|    image: ${REGISTRY}/${IMAGE}:${IMAGE_TAG}|" "$yml"
                        git config user.email "jenkins@ci.local"
                        git config user.name  "Jenkins CI"
                        git add "$yml"
                        git commit -m "deploy: ${REGISTRY}/${IMAGE}:${IMAGE_TAG}" || echo "No changes"
                    '''
                    withCredentials([usernamePassword(credentialsId: "${MANIFEST_CRED_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh 'git push https://${GIT_USER}:${GIT_TOKEN}@github.com/ankitv1504/TaskManage-ci-cd-menifest.git HEAD:${MANIFEST_BRANCH}'
                    }
                    sh '''
                        set -e
                        if docker compose version >/dev/null 2>&1; then
                          COMPOSE="docker compose"
                        else
                          COMPOSE="docker-compose"
                        fi
                        $COMPOSE pull
                        $COMPOSE up -d
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes (Helm)') {
            when { expression { return params.DEPLOY_K8S } }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'helm-k8s-credentials', usernameVariable: 'HELM_USER', passwordVariable: 'HELM_PASS')]) {
                        sh '''
                          set -e
                          helm repo add todo-app-repo https://github.com/ankitv1504/TaskManage-ci-cd-menifest/helm
                          helm repo update
                          helm upgrade --install todo-app ./helm/todo-app \
                            --set image.repository=${REGISTRY}/${IMAGE} \
                            --set image.tag=${IMAGE_TAG} \
                            --set service.port=80 \
                            --set service.targetPort=3009
                        '''
                    }
                }
            }
        }

        stage('Helm: Prometheus & Grafana (optional)') {
            when { expression { return params.INSTALL_MON } }
            steps {
                script {
                    sh '''
                        set -e
                        kubectl cluster-info
                        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts || true
                        helm repo update
                        helm upgrade --install kube-prom prometheus-community/kube-prometheus-stack \
                          --namespace monitoring --create-namespace
                        kubectl get secret -n monitoring \
                          $(kubectl get secret -n monitoring | awk '/grafana/ {print $1; exit}') \
                          -o jsonpath="{.data.admin-password}" | base64 -d || true
                        echo ""
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployed: ${env.REGISTRY}/${env.IMAGE}:${env.IMAGE_TAG}"
            script {
                try {
                    slackSend(channel: "${SLACK_CHANNEL}", message: ":white_check_mark: *SUCCESS* ${env.JOB_NAME} #${env.BUILD_NUMBER} -> ${env.REGISTRY}/${env.IMAGE}:${env.IMAGE_TAG}")
                } catch (e) { echo "Slack not configured or plugin missing" }
            }
            emailext subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Build succeeded and deployed image ${env.REGISTRY}/${env.IMAGE}:${env.IMAGE_TAG}",
                     to: "you@example.com"
        }
        failure {
            script {
                try {
                    slackSend(channel: "${SLACK_CHANNEL}", message: ":x: *FAILED* ${env
