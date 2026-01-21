# Запуск проекта (RU)

Требования: Node.js 18+ и npm.

## Режим разработки (фронт + сервер)
Откройте два терминала.

Терминал 1:
```sh
cd devdata-embark
npm install
npm run dev
```

Терминал 2:
```sh
cd devdata-embark/server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Открыть в браузере: `http://localhost:8080`

## Режим «продакшн» (сервер отдаёт собранный фронт)
```sh
cd devdata-embark
npm install
npm run build
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Открыть в браузере: `http://localhost:3001`

## Переменные окружения (опционально)
Создайте файл `.env` в корне проекта и укажите API:
```
VITE_API_URL=http://localhost:3001
```
