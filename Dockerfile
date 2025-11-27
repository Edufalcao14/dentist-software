# syntax=docker/dockerfile:1

ARG NODE_VERSION=18

################################################################################
# Base stage for all subsequent stages, with Node.js and working directory set up.
# Using Alpine 3.18 which has openssl1.1-compat package needed for Prisma
FROM node:${NODE_VERSION}-alpine3.18 as base
# Install OpenSSL 1.1.x compatibility library for Prisma
RUN apk add --no-cache openssl1.1-compat
WORKDIR /usr/src/app

################################################################################
# Dependencies stage for installing production dependencies.
# This stage is only relevant for preparing the production build.
FROM base as deps
# Install production dependencies only.
COPY package.json package-lock.json ./
RUN npm ci --only=production

################################################################################
# Build stage for compiling the application.
FROM base as build
# Install all dependencies (including dev) for the build process.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

################################################################################
# Development stage for setting up a local development environment.
FROM base as development
# Install all dependencies (including dev).
# This ensures that development dependencies are available for this stage.
COPY package.json package-lock.json ./
RUN npm install
# Copy all source files into the image.
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Expose the port for the development server.
EXPOSE 3000
# Command to start the development server.
CMD ["npm", "run", "dev"]

################################################################################
# Final stage for running the application with minimal runtime dependencies.
FROM base as final
ENV NODE_ENV=production
USER node
COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
