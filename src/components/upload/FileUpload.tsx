
import React, { useState, useRef } from 'react';
import { Upload, File, X, FileJson, FilePdf, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { uploadDocument } from '@/services/documentService';
import { Document } from '@/types/document';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileType || !['json', 'pdf', 'txt'].includes(fileType)) {
      toast.error('Unsupported file type. Please upload JSON, PDF, or TXT files only.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const response = await uploadDocument(selectedFile);
      
      if (response.success) {
        toast.success(`File ${selectedFile.name} uploaded successfully`);
        setSelectedFile(null);
        navigate('/documents');
      } else {
        toast.error(response.message || 'Error uploading file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    const fileType = selectedFile?.name.split('.').pop()?.toLowerCase();
    
    switch (fileType) {
      case 'json':
        return <FileJson className="w-10 h-10 text-blue-500" />;
      case 'pdf':
        return <FilePdf className="w-10 h-10 text-red-500" />;
      case 'txt':
        return <FileText className="w-10 h-10 text-gray-500" />;
      default:
        return <File className="w-10 h-10 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-primary/50 dark:hover:bg-gray-900/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">
                Drag and drop your file here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supports JSON, PDF, and TXT files
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">or</span>
            </div>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative overflow-hidden"
            >
              Browse Files
              <input
                type="file"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".json,.pdf,.txt"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {getFileIcon()}
              <div className="ml-4">
                <h4 className="font-medium">{selectedFile.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-10 border-t pt-8">
        <h3 className="text-lg font-medium mb-4">Supported File Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileTypeCard 
            icon={<FileJson className="w-6 h-6 text-blue-500" />} 
            title="JSON Files" 
            description="Structured data in JSON format"
          />
          <FileTypeCard 
            icon={<FilePdf className="w-6 h-6 text-red-500" />} 
            title="PDF Documents" 
            description="Text extraction from PDF files"
          />
          <FileTypeCard 
            icon={<FileText className="w-6 h-6 text-gray-500" />} 
            title="Text Files" 
            description="Plain text content in TXT format"
          />
        </div>
      </div>
    </div>
  );
};

interface FileTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FileTypeCard: React.FC<FileTypeCardProps> = ({ icon, title, description }) => {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 hover-lift">
      <div className="flex items-start">
        <div className="mr-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
