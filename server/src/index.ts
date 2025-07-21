// server/src/index.ts

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// إنشاء مجلد uploads إذا لم يكن موجودًا
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// إعداد multer لتخزين الملفات فعليًا
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// دالة لتأخير التنفيذ (محاكاة المعالجة)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ دالة المعالجة الوهمية (تحديث قاعدة البيانات)
async function processDocument(id: string) {
  await delay(2000); // محاكاة وقت المعالجة
  await prisma.document.update({
    where: { id },
    data: {
      processed: true,
    },
  });

  await delay(2000); // محاكاة وقت إنشاء embedding
  await prisma.document.update({
    where: { id },
    data: {
      embedding: true,
      vectorId: uuidv4(),
    },
  });

  console.log(`📌 Document ${id} processed and embedded`);
}

// ✅ رفع ملف وتخزينه في قاعدة البيانات
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "لم يتم رفع أي ملف." });

  const { originalname, mimetype, size, filename } = req.file;

  // معاينة أول 200 حرف من الملف إذا كان txt أو json
  let preview = "";
  const filePath = path.join(uploadsDir, filename);
  if (mimetype === "text/plain" || mimetype === "application/json") {
    preview = fs.readFileSync(filePath, "utf-8").slice(0, 200);
  }

  const document = await prisma.document.create({
    data: {
      name: originalname,
      filename,
      fileType: path.extname(filename).slice(1).toLowerCase(),
      size,
      processed: false,
      embedding: false,
      preview,
    },
  });

  // تشغيل المعالجة في الخلفية
  processDocument(document.id).catch(console.error);

  res.json({ success: true, file: document });
});

// ✅ جلب جميع الملفات من قاعدة البيانات
app.get("/api/documents", async (_req, res) => {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ documents });
});

// ✅ جلب ملف واحد
app.get("/api/document/:id", async (req, res) => {
  const document = await prisma.document.findUnique({
    where: { id: req.params.id },
  });

  if (!document) {
    return res.status(404).json({ error: "الملف غير موجود" });
  }

  res.json({ document });
});

// ✅ حذف ملف من السيرفر وقاعدة البيانات
app.delete("/api/delete/:id", async (req, res) => {
  const document = await prisma.document.findUnique({
    where: { id: req.params.id },
  });

  if (!document) {
    return res.status(404).json({ error: "الملف غير موجود" });
  }

  const filePath = path.join(uploadsDir, document.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.document.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true });
});

// ✅ إحصائيات الملفات من قاعدة البيانات
app.get("/api/stats", async (_req, res) => {
  const totalDocuments = await prisma.document.count();
  const processedDocuments = await prisma.document.count({ where: { processed: true } });
  const embeddedDocuments = await prisma.document.count({ where: { embedding: true } });

  const sizeData = await prisma.document.findMany({
    select: { size: true },
  });
  const totalSize = sizeData.reduce((sum, doc) => sum + doc.size, 0);

  res.json({
    totalDocuments,
    processedDocuments,
    embeddedDocuments,
    totalSize,
  });
});

// ✅ تشغيل الخادم
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
