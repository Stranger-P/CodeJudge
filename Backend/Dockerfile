# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy rest of the code
COPY . .

# Set environment variables (in deployment, you'll override via Render or docker-compose)
ENV PORT=3000

# Expose the backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
