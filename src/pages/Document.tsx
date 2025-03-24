
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDocument, deleteDocument } from '@/services/documentService';
import { Document as DocumentType } from '@/types/document';
import { toast } from 'sonner';
import { FileJson, FilePdf, FileText, Trash2, ChevronLeft, Clock, CheckCircle, Database } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const doc = await getDocument(id);
        if (doc) {
          setDocument(doc);
        } else {
          toast.error('Document not found');
          navigate('/documents');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Error loading document');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
    
    // Set up polling for updates
    const intervalId = setInterval(() => {
      if (id) fetchDocument();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [id, navigate]);

  const handleDeleteDocument = async () => {
    if (!document) return;
    
    try {
      const success = await deleteDocument(document.id);
      if (success) {
        toast.success('Document deleted successfully');
        navigate('/documents');
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'json':
        return <FileJson className="w-10 h-10 text-blue-500" />;
      case 'pdf':
        return <FilePdf className="w-10 h-10 text-red-500" />;
      case 'txt':
        return <FileText className="w-10 h-10 text-gray-500" />;
      default:
        return <FileText className="w-10 h-10 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (isLoading) {
    return (
      <Layout className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The document you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <a href="/documents">Back to Documents</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/documents')} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to All Documents
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 mr-4">
                {getFileIcon(document.fileType)}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{document.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded {formatDistanceToNow(document.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteDocument}
              className="mt-4 md:mt-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Document
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">File Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">{document.fileType.toUpperCase()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">File Size</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">{formatFileSize(document.size)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
            </CardHeader>
            <CardContent>
              {document.processed ? (
                document.embedding ? (
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-lg font-medium text-green-600 dark:text-green-400">Embedded</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">Processed</span>
                  </div>
                )
              ) : (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-amber-500 mr-2" />
                  <span className="text-lg font-medium text-amber-600 dark:text-amber-400">Processing</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Document Preview</h2>
          <Card>
            <CardContent className="p-6">
              {document.preview ? (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                    {document.preview}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No preview available for this document type.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {document.embedding && (
          <div>
            <h2 className="text-xl font-bold mb-4">Embedding Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Vector ID</p>
                    <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {document.vectorId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-green-600 dark:text-green-400">Ready for use</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentDetail;
