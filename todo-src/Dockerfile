FROM node:20.9-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./
RUN npm install --silent

# Copy app source code
COPY . .

# Expose the port your app is listening on (make sure this matches the port in your app)
EXPOSE 3010

CMD ["npm", "start"]
