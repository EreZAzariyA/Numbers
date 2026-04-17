# Stage 1: Build React app
FROM node:20-slim AS builder

ARG REACT_APP_BASE_URL
ARG REACT_APP_GOOGLE_CLIENT_ID

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps && \
    npm install ajv@^8 @types/react@18.2.74 @types/react-dom@18.2.24 --no-save --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
