FROM php:8.2-apache
WORKDIR /var/www/html
EXPOSE 8082
# Enable Apache modules
RUN a2enmod rewrite

RUN apt-get update -y && apt-get install -y libmariadb-dev
RUN docker-php-ext-install mysqli pdo pdo_mysql sockets
RUN docker-php-ext-enable sockets
# CMD ["php", "./server.php"]