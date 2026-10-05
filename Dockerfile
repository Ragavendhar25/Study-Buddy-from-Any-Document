# Base Node image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source files
COPY . .

# Build Vite frontend assets
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Run Full-stack server
CMD ["npm", "run", "start"]
