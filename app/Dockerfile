# Step 1: Use a Node.js base image
FROM node:20.10.0 as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source codes
COPY . .

# Build the app
RUN npm run build

# Step 2: Use a smaller base image for the production stage
FROM node:20.10.0-slim

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built assets from the build stage
COPY --from=build-stage /app/build /app/build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build"]