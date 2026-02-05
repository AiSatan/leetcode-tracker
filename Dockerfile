# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine AS runner

WORKDIR /app

# Install the static server
RUN npm install -g serve

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port (serve defaults to 3000)
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
