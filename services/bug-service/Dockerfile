# Bug Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy Prisma schema from root
COPY ../../prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate --schema=../../prisma/schema.prisma || true

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5002

CMD ["npm", "run", "dev"]
