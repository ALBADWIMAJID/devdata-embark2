import React, { useState, useEffect } from 'react';
import { 
  FileJson, FileType, FileText, Trash2, CheckCircle, Clock, Search,
  SortAsc, SortDesc, ChevronDown, MoreHorizontal, Database 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Document } from '@/types/document';
import { getDocuments, deleteDocument } from '@/services/documentService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'size'>('createdAt');

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const docs = await getDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
    
    // Set up polling for updates
    const intervalId = setInterval(fetchDocuments, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'createdAt') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, sortOrder, sortField]);

  const handleDeleteDocument = async (id: string) => {
    try {
      const success = await deleteDocument(id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        toast.success('Document deleted successfully');
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'json':
        return <FileJson className="w-5 h-5 text-blue-500" />;
      case 'pdf':
        return <FileType className="w-5 h-5 text-red-500" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (field: 'name' | 'createdAt' | 'size') => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('createdAt')}>Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('size')}>Size</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search query' : 'Upload your first document to get started'}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link to="/upload">Upload Document</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Filename</span>
                      {sortField === 'name' && (
                        sortOrder === 'asc' ? 
                          <SortAsc className="w-3 h-3" /> : 
                          <SortDesc className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="hidden sm:table-cell text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="hidden md:table-cell text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                    <button 
                      onClick={() => handleSort('size')}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Size</span>
                      {sortField === 'size' && (
                        sortOrder === 'asc' ? 
                          <SortAsc className="w-3 h-3" /> : 
                          <SortDesc className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                    <button 
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Uploaded</span>
                      {sortField === 'createdAt' && (
                        sortOrder === 'asc' ? 
                          <SortAsc className="w-3 h-3" /> : 
                          <SortDesc className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium truncate max-w-[200px]">
                            {doc.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.fileType.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {doc.processed ? (
                          doc.embedding ? (
                            <div className="flex items-center">
                              <Database className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                Embedded
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                Processed
                              </span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-amber-500 mr-1" />
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                              Processing
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(doc.createdAt, { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/document/${doc.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={!doc.embedding}>
                              View Embeddings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;