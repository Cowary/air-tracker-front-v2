# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем шаблон конфига (не финальный конфиг)
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

# Скрипт-обёртка: подставляет env-переменные в nginx конфиг при старте
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# Заменяем переменные в шаблоне nginx.conf
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Запускаем оригинальный entrypoint nginx
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
