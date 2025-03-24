
import React from 'react';
import Layout from '@/components/layout/Layout';
import FileUpload from '@/components/upload/FileUpload';
import { FileText } from 'lucide-react';

const Upload = () => {
  return (
    <Layout className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            <FileText className="w-4 h-4 mr-1" />
            File Upload
          </div>
          <h1 className="text-3xl font-bold mb-4">Upload Your Documents</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload JSON, PDF, or TXT files for processing and embedding generation.
          </p>
        </div>
        
        <FileUpload />
      </div>
    </Layout>
  );
};

export default Upload;
