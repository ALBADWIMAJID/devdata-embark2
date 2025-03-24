
import React from 'react';
import Layout from '@/components/layout/Layout';
import DocumentList from '@/components/documents/DocumentList';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documents = () => {
  return (
    <Layout className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              <FileText className="w-4 h-4 mr-1" />
              Document Management
            </div>
            <h1 className="text-3xl font-bold mb-2">Your Documents</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Manage your uploaded documents and view their processing status.
            </p>
          </div>
          
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/upload" className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Upload New
            </Link>
          </Button>
        </div>
        
        <div className="mb-10">
          <DashboardStats />
        </div>
        
        <div>
          <DocumentList />
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
