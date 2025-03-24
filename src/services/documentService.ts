
import { Document, DocumentStats, UploadResponse } from '../types/document';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// In-memory storage for documents (would be replaced with actual DB in production)
const documents: Document[] = [];

// Simulate document processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadDocument = async (
  file: File
): Promise<UploadResponse> => {
  try {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['json', 'pdf', 'txt'].includes(fileExtension)) {
      return {
        success: false,
        message: 'Unsupported file type. Please upload JSON, PDF, or TXT files only.',
        document: {} as Document
      };
    }

    // Read file content for preview
    let preview = '';
    if (fileExtension === 'txt' || fileExtension === 'json') {
      const text = await file.text();
      preview = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    } else {
      preview = 'PDF content preview not available';
    }

    // Create document entry
    const newDocument: Document = {
      id: uuidv4(),
      name: file.name,
      fileType: fileExtension as 'json' | 'pdf' | 'txt',
      size: file.size,
      createdAt: new Date(),
      processed: false,
      embedding: false,
      preview
    };

    // Store document
    documents.push(newDocument);

    // Simulate processing in background
    processDocument(newDocument.id);

    return {
      success: true,
      document: newDocument
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      message: 'Error uploading document. Please try again.',
      document: {} as Document
    };
  }
};

export const getDocuments = async (): Promise<Document[]> => {
  // In a real app, this would fetch from API/database
  await delay(300); // Simulate network delay
  return [...documents].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

export const getDocument = async (id: string): Promise<Document | null> => {
  await delay(200);
  return documents.find(doc => doc.id === id) || null;
};

export const getDocumentStats = async (): Promise<DocumentStats> => {
  await delay(300);
  
  return {
    totalDocuments: documents.length,
    processedDocuments: documents.filter(d => d.processed).length,
    embeddedDocuments: documents.filter(d => d.embedding).length,
    totalSize: documents.reduce((acc, doc) => acc + doc.size, 0)
  };
};

// Simulate document processing and embedding
const processDocument = async (id: string): Promise<void> => {
  const doc = documents.find(d => d.id === id);
  if (!doc) return;

  try {
    // Simulate document processing
    await delay(2000);
    
    // Update processing status
    doc.processed = true;
    toast.success(`Document "${doc.name}" processed successfully`);
    
    // Simulate embedding creation
    await delay(3000);
    
    // Update embedding status
    doc.embedding = true;
    doc.vectorId = uuidv4();
    toast.success(`Embeddings created for "${doc.name}"`);
  } catch (error) {
    console.error('Error processing document:', error);
    toast.error(`Error processing document "${doc.name}"`);
  }
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  const index = documents.findIndex(d => d.id === id);
  if (index !== -1) {
    documents.splice(index, 1);
    return true;
  }
  return false;
};
