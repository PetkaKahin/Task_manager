FROM php:8.4-fpm

# Аргументы для пользователя
ARG USER_ID=1000
ARG GROUP_ID=1000

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Установка PHP расширений
RUN docker-php-ext-configure intl \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Установка Redis расширения
RUN pecl install redis \
    && docker-php-ext-enable redis

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создание пользователя
RUN groupadd -g ${GROUP_ID} laravel \
    && useradd -u ${USER_ID} -g laravel -m laravel

# Настройка рабочей директории
WORKDIR /var/www/app

# Права на директории
RUN chown -R laravel:laravel /var/www/app

# Переключение на пользователя
USER laravel

EXPOSE 9000

CMD ["php-fpm"]