import { Document, DocumentStats, UploadResponse } from '../types/document';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

// ✅ رفع ملف
export const uploadDocument = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');

    const data = await res.json();
    return {
      success: true,
      document: {
        id: data.file.id,
        name: data.file.name,
        filename: data.file.filename,
        fileType: data.file.fileType,
        size: data.file.size,
        createdAt: new Date(data.file.createdAt),
        processed: data.file.processed,
        embedding: data.file.embedding,
        preview: data.file.preview,
        vectorId: data.file.vectorId ?? null,
      },
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      message: 'Upload failed',
      document: {} as Document,
    };
  }
};

// ✅ جلب كل الملفات
export const getDocuments = async (): Promise<Document[]> => {
  const res = await fetch(`${API_URL}/api/documents`);
  const data = await res.json();
  return data.documents.map((doc: any) => ({
    ...doc,
    createdAt: new Date(doc.createdAt),
  }));
};

// ✅ جلب ملف واحد
export const getDocument = async (id: string): Promise<Document | null> => {
  const res = await fetch(`${API_URL}/api/document/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    ...data.document,
    createdAt: new Date(data.document.createdAt),
  };
};

// ✅ إحصائيات
export const getDocumentStats = async (): Promise<DocumentStats> => {
  const res = await fetch(`${API_URL}/api/stats`);
  return res.json();
};

// ✅ حذف ملف
export const deleteDocument = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/api/delete/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
};
