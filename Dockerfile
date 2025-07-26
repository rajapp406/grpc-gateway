# Dockerfile for gRPC Gateway Service
FROM node:24-alpine AS builder
WORKDIR /app

# Install all dependencies including devDependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production image
FROM node:24-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env* ./

# Create proto directory and copy proto files
RUN mkdir -p /app/proto
COPY --from=builder /app/src/proto/*.proto /app/proto/

ENV NODE_ENV=production
EXPOSE 3900

CMD ["node", "dist/main.js"]
