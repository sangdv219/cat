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
RUN echo "${PF_ENV}" > /app/.env
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

# ARG DB_HOST
# ARG DB_PORT
# ARG DB_USER
# ARG DB_PASSWORD
# ARG DB_DATABASE
# ARG JWT_SECRET
# ARG ACCESS_TOKEN_SECRET
# ARG REFRESH_TOKEN_SECRET
# ARG OTP_TOKEN_SECRET
# ARG SMTP_USER
# ARG SMTP_PASS
# ARG NODE_ENV
# ARG SONAR_TOKEN

# ENV DB_HOST=$DB_HOST
# ENV DB_PORT=$DB_PORT
# ENV DB_USER=$DB_USER
# ENV DB_PASSWORD=$DB_PASSWORD
# ENV DB_DATABASE=$DB_DATABASE
# ENV JWT_SECRET=$JWT_SECRET
# ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
# ENV REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
# ENV OTP_TOKEN_SECRET=$OTP_TOKEN_SECRET
# ENV SMTP_USER=$SMTP_USER
# ENV SMTP_PASS=$SMTP_PASS
# ENV NODE_ENV=$NODE_ENV
# ENV SONAR_TOKEN=$SONAR_TOKEN