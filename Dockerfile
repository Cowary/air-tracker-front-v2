# Build stage
FROM node:20-alpine AS builder

ARG VITE_BACKEND_URL=http://localhost:8080

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN VITE_BACKEND_URL=${VITE_BACKEND_URL} npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
