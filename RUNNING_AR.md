# تشغيل المشروع (AR)

المتطلبات: Node.js 18+ و npm.

## وضع التطوير (واجهة + خادم)
افتح نافذتين Terminal.

النافذة 1:
```sh
git clone <REPO_URL>
cd devdata-embark
npm install
npm run dev
```

النافذة 2:
```sh
cd devdata-embark/server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

افتح في المتصفح: `http://localhost:8080`

## وضع الإنتاج (الخادم يعرض الواجهة بعد البناء)
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

افتح في المتصفح: `http://localhost:3001`

## متغيرات البيئة (اختياري)
أنشئ ملف `.env` في جذر المشروع وضع:
```
VITE_API_URL=http://localhost:3001
```
