#!/bin/sh
set -e

# Подставляем BACKEND_URL из переменной окружения в nginx конфиг
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Запускаем nginx
exec nginx -g 'daemon off;'
