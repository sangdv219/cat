# Install dependencies only when needed
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package.json ./
RUN npm install


# Rebuild the source code only when needed
FROM node:20-alpine AS builder   
WORKDIR /app
RUN echo "${NODE_ENV}" > /app/.env.staging
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env .env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
# CMD ["node", "dist/main"]
EXPOSE 3000
CMD ["node", "dist/main"]