FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Stage 2: production
FROM node:18-alpine AS production   
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]