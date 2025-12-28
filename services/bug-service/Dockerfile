# Bug Service Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5002

CMD ["npm", "run", "dev"]
