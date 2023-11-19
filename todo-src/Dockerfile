#  Dockerfile for Node Express Backend

FROM node:20.9-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

# Exports
EXPOSE 8082

CMD ["npm","start"]
