# =============================================================================
# Dockerfile for Task Management API
# =============================================================================
# This Dockerfile uses a MULTI-STAGE BUILD:
# 1. Build stage: Compile TypeScript to JavaScript
# 2. Production stage: Run the compiled application
#
# Multi-stage builds make images smaller and more secure by only including
# what's needed to run the app (not build tools like TypeScript compiler).
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
# Purpose: Install dependencies and compile TypeScript to JavaScript
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
# Docker caches layers - if package.json hasn't changed, skip npm install
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript compiler)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
# Purpose: Run the compiled application with minimal image size
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies (no devDependencies)
# This makes the image smaller and more secure
RUN npm ci --only=production

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
# Running as root inside containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Health check - Docker/Kubernetes uses this to verify the container is healthy
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Command to run when container starts
CMD ["node", "dist/index.js"]
