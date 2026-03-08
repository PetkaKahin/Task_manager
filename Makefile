composer:
	docker compose exec php composer

format:
	docker compose exec php composer format

php-tests:
	docker compose exec php php artisan test

php-ide-helper:
	docker compose exec php php artisan ide-helper:generate

php:
	docker compose exec php php

stan:
	docker compose exec php ./vendor/bin/phpstan analyse --memory-limit=512M

dev:
	docker compose run --rm --service-ports npm run dev