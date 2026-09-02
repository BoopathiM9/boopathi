FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency declarations
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose container port
EXPOSE 3000

# Start server
CMD ["node", "app.js"]