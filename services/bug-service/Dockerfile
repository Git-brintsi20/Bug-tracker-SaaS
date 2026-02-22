# Bug Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (without postinstall)
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npx tsc

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5002

CMD ["npm", "start"]
