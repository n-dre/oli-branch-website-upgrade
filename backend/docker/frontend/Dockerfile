# docker/frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY ../frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY ../frontend/ .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run the application
CMD ["serve", "-s", "build", "-l", "3000"]