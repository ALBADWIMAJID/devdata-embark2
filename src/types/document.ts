export interface Document {
  id: string;
  name: string;
  filename: string; // ✅ تمت إضافته هنا
  fileType: 'json' | 'pdf' | 'txt';
  size: number;
  createdAt: Date;
  processed: boolean;
  embedding?: boolean;
  vectorId?: string;
  content?: string;
  preview?: string;
}

export interface DocumentStats {
  totalDocuments: number;
  processedDocuments: number;
  embeddedDocuments: number;
  totalSize: number;
}

export interface UploadResponse {
  document: Document;
  success: boolean;
  message?: string;
}
