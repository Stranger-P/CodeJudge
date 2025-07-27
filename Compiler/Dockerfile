# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install compilers and interpreters
RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip \
    make

# Copy only what's needed
COPY . .

# Install Node.js dependencies
RUN npm ci --only=production

# Expose the port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
