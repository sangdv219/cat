# Install dependencies only when needed
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package.json ./
RUN npm install


# Rebuild the source code only when needed
FROM node:20-alpine AS builder   
ARG PF_ENV
ARG PF_ENV=staging 
WORKDIR /app
RUN echo "${PF_ENV}" > /app/.env.staging
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env .env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
# CMD ["node", "dist/main"]
CMD ["node", "dist/main"]