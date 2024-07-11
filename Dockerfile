# Use the official Node.js image.
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy the backend package files and install dependencies.
COPY backend/package*.json ./
RUN npm install

# Copy the backend source code.
COPY backend/ ./

# Expose the port the app runs on.
EXPOSE 3001

# Start the application.
CMD [ "node", "app.js" ]
