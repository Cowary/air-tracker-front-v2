# Air Tracker Front v2

## Project Overview

**Air Tracker** — это веб-приложение для отслеживания медиа-контента (аниме, фильмы, сериалы, игры, книги, манга) в одном месте. Фронтенд построен на **Vue 3** с использованием **Vite** в качестве сборщика.

### Tech Stack

- **Vue 3** — UI-фреймворк (Composition API, `<script setup>`)
- **Vue Router 4** — маршрутизация
- **Axios** — HTTP-клиент для взаимодействия с бэкендом
- **Vite** — сборщик и dev-сервер

### Architecture

```
src/
├── api/            # API-клиенты (axios instance, interceptors, endpoints)
├── assets/         # Статические ресурсы
├── components/     # Переиспользуемые Vue-компоненты
├── router/         # Конфигурация маршрутизации
├── views/          # Страницы приложения
├── App.vue         # Корневой компонент
├── main.js         # Точка входа
└── style.css       # Глобальные стили
```

### Routes

| Path       | Component      | Description        |
|------------|----------------|--------------------|
| `/`        | `HomePage.vue` | Главная страница   |
| `/media`   | `MediaListPage.vue` | Список медиа |
| `/anime`   | `AnimePage.vue` | Страница аниме    |
| `/login`   | `LoginPage.vue` | Авторизация       |

### Backend Integration

Бэкенд работает на `http://192.168.1.74:8080`. API разделено на модули:

- **authApi** — аутентификация (`/api/auth/sign-in`)
- **mediaApi** — получение списка медиа (`/title/view/media`)
- **animeApi** — CRUD операции для аниме (`/title/anime/*`)

Аутентификация через Bearer-токен, хранящийся в `localStorage`. Токен автоматически подставляется в заголовок `Authorization` через axios interceptor.

## Building and Running

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

## Development Conventions

- Используются **Vue 3 SFC** с `<script setup>` синтаксисом
- Модульная структура: API-вызовы вынесены в `src/api/`, маршруты в `src/router/`
- Глобальные стили в `style.css`, компонентные — в `<style scoped>`
- Тип проекта: ES-модули (`"type": "module"`)

## Key Files

| File | Description |
|------|-------------|
| `src/api/index.js` | Конфигурация axios, interceptors, все API-эндпоинты |
| `src/router/index.js` | Определение маршрутов |
| `src/main.js` | Инициализация приложения, подключение роутера |
| `package.json` | Зависимости, скрипты, версия (0.0.1) |
| `air-tracker-back-spec.json` | Спецификация бэкенд API |
