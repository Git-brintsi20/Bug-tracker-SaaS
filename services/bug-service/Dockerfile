# Bug Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (postinstall will generate Prisma client)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5002

CMD ["npm", "run", "dev"]
