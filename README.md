# Task Manager

> Kanban-доска для управления задачами с drag-and-drop, rich-text редактором и многопользовательскими проектами.

Веб-приложение на Laravel 12 и Vue 3 для организации задач в формате Kanban-доски. Поддерживает перетаскивание задач и колонок (LexoRank), форматирование текста (Tiptap), адаптивный интерфейс для мобильных и десктопных устройств.

## Быстрый старт

```bash
git clone https://github.com/PetkaKahin/Task_manager.git
cd Task_manager
composer setup
```

Или через Docker:

```bash
docker compose up -d --build
docker compose exec php composer install
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate
docker compose exec php php artisan ziggy:generate --types
docker compose run --rm npm install
docker compose run --rm npm run build
```

## Возможности

- **Kanban-доска** — колонки (категории) и карточки (задачи) с drag-and-drop
- **Rich-text редактор** — форматирование описания задач через Tiptap
- **Многопользовательские проекты** — совместный доступ к проектам
- **Адаптивный дизайн** — отдельные версии для десктопа и мобильных
- **LexoRank** — эффективная сортировка при перетаскивании

## Разработка

Запустите все сервисы одной командой:

```bash
docker compose run --rm --service-ports npm run dev
```

### Основные команды

| Команда | Описание |
|---------|----------|
| `composer dev` | Запуск всех сервисов разработки |
| `composer test` | Запуск тестов |
| `php artisan pint` | Форматирование кода |
| `npm run build` | Продакшен-сборка фронтенда |
| `php artisan ziggy:generate --types` | Пересборка маршрутов после изменений |

---

## Документация

| Руководство | Описание |
|------------|----------|
| [Начало работы](docs/getting-started.md) | Установка, настройка, первый запуск |
| [Архитектура](docs/architecture.md) | Структура проекта и паттерны |
| [API Reference](docs/api.md) | Эндпоинты и формат запросов |
| [Конфигурация](docs/configuration.md) | Переменные окружения и настройки |

## Лицензия

MIT
