FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies including dev dependencies needed for build
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate prisma client (also happens postinstall, but good to ensure)
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 10000

# Start deployment migration and then the application
CMD npx prisma migrate deploy && npm run start:prod
