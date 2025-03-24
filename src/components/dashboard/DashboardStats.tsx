
import React, { useState, useEffect } from 'react';
import { FileText, Database, HardDrive, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDocumentStats } from '@/services/documentService';
import { DocumentStats } from '@/types/document';
import { toast } from 'sonner';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const documentStats = await getDocumentStats();
        setStats(documentStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Setup polling for real-time updates
    const intervalId = setInterval(fetchStats, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 bytes';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No statistics available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toString(),
      description: 'Documents uploaded',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Processed',
      value: stats.processedDocuments.toString(),
      description: 'Documents processed',
      icon: <Upload className="h-5 w-5 text-green-600" />,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Embeddings',
      value: stats.embeddedDocuments.toString(),
      description: 'Documents embedded',
      icon: <Database className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Total Size',
      value: formatFileSize(stats.totalSize),
      description: 'Storage used',
      icon: <HardDrive className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className="hover-lift">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.color}`}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
