# Территория Доброты

Сайт приюта и небольшой backend для управления животными, приёмом пожертвований и контактами.

## Структура проекта

- `backend/` — Node.js + Express, Prisma, SQLite
- `frontend/views/` — HTML-страницы
- `frontend/public/` — статические файлы, изображения, JS
- `docs/` — документы для скачивания
- `docker-compose.yml` — локальный запуск контейнеров (для разработки)

> На сервере с уже работающим `nginx` рекомендуется не запускать контейнерный `nginx` из `docker-compose.yml`. Лучше использовать системный `nginx` и запуск backend как сервис.

## Локальная разработка

### Установка

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Запуск

```bash
cd backend
npm run dev
```

Фронтенд можно открыть напрямую из `frontend/views/index.html` и `frontend/views/donation.html`.

## Git: подготовка и публикация

1. Инициализируйте репозиторий, если ещё не инициализировано:

```bash
git init
git add .
git commit -m "Initial project structure"
```

2. Добавьте удалённый репозиторий:

```bash
git remote add origin <your-git-url>
```

3. Отправьте на GitHub / GitLab:

```bash
git branch -M main
git push -u origin main
```

4. После изменений:

```bash
git add .
git commit -m "Update deployment docs and backend config"
git push
```

## Развёртывание на сервере

### 1. Установите зависимости на сервере

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

Убедитесь, что установлен Node.js 18+:

```bash
node -v
npm -v
```

Если Node.js не установлен, установите его по инструкции для вашей системы.

### 2. Клонируйте репозиторий

```bash
cd /var/www
sudo git clone <your-git-url> territoriya-dobroty.ru
sudo chown -R $USER:$USER territoriya-dobroty.ru
cd territoriya-dobroty.ru/backend
```

Если репозиторий уже есть на сервере, используйте:

```bash
cd /var/www/territoriya-dobroty.ru
git pull origin main
```

### 3. Установите backend-зависимости

```bash
cd /var/www/territoriya-dobroty.ru/backend
npm install
```

### 4. Сгенерируйте Prisma-клиент и запустите миграции

```bash
npx prisma generate
npx prisma migrate deploy
```

> После первого запуска в `backend/prisma/dev.db` будет создана база данных SQLite.

### 5. Запустите backend как сервис

Рекомендуемый вариант: `pm2`.

```bash
sudo npm install -g pm2
cd /var/www/territoriya-dobroty.ru/backend
pm2 start src/app.js --name territoriya-dobroty-backend
pm2 save
pm2 startup
```

При обновлениях проекта:

```bash
cd /var/www/territoriya-dobroty.ru
git pull origin main
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 restart territoriya-dobroty-backend
```

### 6. Конфигурация `nginx`

Создайте или замените файл `/etc/nginx/sites-available/territoriya-dobroty.ru` следующим содержимым:

```nginx
server {
    listen 443 ssl;
    server_name territoriya-dobroty.ru www.territoriya-dobroty.ru;

    root /var/www/territoriya-dobroty.ru/frontend/views;
    index index.html;

    location /public/ {
        alias /var/www/territoriya-dobroty.ru/frontend/public/;
        try_files $uri $uri/ =404;
    }

    location /docs/ {
        alias /var/www/territoriya-dobroty.ru/docs/;
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /donation/ {
        try_files $uri $uri/ /donation.html;
    }

    location = /donation {
        return 301 /donation/;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    ssl_certificate /etc/letsencrypt/live/territoriya-dobroty.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/territoriya-dobroty.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name territoriya-dobroty.ru www.territoriya-dobroty.ru;

    return 301 https://$host$request_uri;
}
```

Если файл уже есть, замените содержимое. После этого проверьте конфигурацию и перезапустите `nginx`:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Проверка

- Откройте `https://territoriya-dobroty.ru`
- Откройте `https://territoriya-dobroty.ru/donation/`
- Убедитесь, что `/api/contact` работает через форму
- Убедитесь, что статические файлы загружаются из `/public/`

## Команды для обновления из Git на сервере

```bash
cd /var/www/territoriya-dobroty.ru
git pull origin main
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 restart territoriya-dobroty-backend
sudo nginx -t
sudo systemctl reload nginx
```

## О переменных окружения

В `backend/.env` должны быть:

```env
NODE_ENV=production
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@territoriya-dobroty.ru
ADMIN_PASSWORD=admin123
```

Если хотите хранить пароль в хеше, можно добавить:

```env
ADMIN_PASSWORD_HASH=<bcrypt-hash>
```

В этом случае `ADMIN_PASSWORD` можно не указывать.

## Замечания

- `docker-compose.yml` и `nginx.conf` в корне проекта подходят для локальной разработки и контейнерного запуска.
- В продакшн на сервере используйте `systemd` / `pm2` + системный `nginx`, как описано выше.
- Статический фронтенд обслуживается из `frontend/views`, а данные `/api/*` проксируются на backend.

## Что можно добавить дальше

1. Интеграцию animal CRUD на фронтенде;
2. Авторизацию админа;
3. Полноценный админ-интерфейс с кнопками для управления животными.

Если нужно, я могу сразу сделать эти доработки.