# Laravel Docker Project

Laravel приложение с Vue.js 3, Inertia.js, TypeScript, Pinia, PostgreSQL и Vite на Docker.

## Стек

- **PHP 8.x** + PHP-FPM
- **Nginx**
- **PostgreSQL 18**
- **Node.js** + npm
- **Laravel 12** + Inertia.js
- **Vue 3** + TypeScript + Pinia
- **Axios** для HTTP-запросов
- **SCSS** для стилей

## Требования

- Docker и Docker Compose
- Git

## Быстрый старт

### 1. Клонирование и настройка
```bash
git clone https://github.com/PetkaKahin/Laravel_docker.git
cd Laravel_docker
cp .env.example .env
```

### 2. Настройка `.env`
```env
COMPOSE_PROJECT_NAME=laravel_app

APP_PATH=/var/www/app
APP_WEB_PORT=8080
APP_VITE_PORT=5173

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

UID=1000
GID=1000
```

### 3. Сборка и запуск контейнеров
```bash
docker compose up -d --build
```

### 4. Установка зависимостей
```bash
# PHP зависимости
docker compose exec php composer install

# Генерация ключа приложения
docker compose exec php php artisan key:generate

# Миграции
docker compose exec php php artisan migrate

# Node зависимости
docker compose run --rm npm install
```

### 5. Запуск Vite dev сервера
```bash
docker compose run --rm --service-ports npm run dev
```

### 6. Открыть в браузере

- **Приложение:** http://localhost:8080
- **Vite HMR:** http://localhost:5173

---

## Основные команды

### Artisan
```bash
docker compose exec php php artisan <command>

# Примеры
docker compose exec php php artisan migrate
docker compose exec php php artisan make:model Post -m
docker compose exec php php artisan make:controller Api/PostController --api
docker compose exec php php artisan tinker
docker compose exec php php artisan route:list
docker compose exec php php artisan cache:clear
docker compose exec php php artisan config:clear
```

### Composer
```bash
docker compose exec php composer <command>

# Примеры
docker compose exec php composer install
docker compose exec php composer require laravel/sanctum
docker compose exec php composer dump-autoload
```

### npm
```bash
docker compose run --rm npm <command>

# Примеры
docker compose run --rm -p 5173:5173 npm run dev 
docker compose run --rm npm run build
```

### База данных
```bash
# PostgreSQL CLI
docker compose exec db psql -U laravel -d laravel

# Полезные psql команды
\dt          # Список таблиц
\d users     # Структура таблицы
\q           # Выход
```

---

## Управление контейнерами
```bash
# Запуск
docker compose up -d

# Остановка
docker compose down

# Пересборка
docker compose up -d --build

# Логи
docker compose logs -f php
docker compose logs -f nginx
docker compose logs -f db

# Shell доступ
docker compose exec php sh
docker compose exec db sh
```
---
