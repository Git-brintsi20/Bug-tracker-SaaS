# Auth Service Dockerfile
FROM node:20-alpine

# Install OpenSSL so Prisma can detect the correct engine binary
RUN apk add --no-cache openssl

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

EXPOSE 5001

CMD ["npm", "start"]
