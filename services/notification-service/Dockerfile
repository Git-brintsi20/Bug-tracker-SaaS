# Notification Service Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g typescript

# Copy source code
COPY . .

# Build the TypeScript code
RUN npx tsc

EXPOSE 5003

CMD ["npm", "start"]
