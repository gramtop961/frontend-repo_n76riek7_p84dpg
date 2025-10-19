import React, { useState, useEffect } from 'react';
import { DatabaseIcon, TableIcon, SearchIcon, PlusIcon, EditIcon, TrashIcon, RefreshCwIcon } from 'lucide-react';
import DocumentEditor from './DocumentEditor';

const DatabaseViewer = ({ projectId, apiBaseUrl = '/api' }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const [showEditor, setShowEditor] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, [projectId]);

  // Fetch documents when collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchDocuments();
    }
  }, [selectedCollection, pagination.page]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/database/${projectId}/collections`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.ok) {
        setCollections(result.collections);
        if (result.collections.length > 0 && !selectedCollection) {
          setSelectedCollection(result.collections[0]);
        }
      } else {
        setError(result.error || 'Failed to fetch collections');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!selectedCollection) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      const response = await fetch(
        `${apiBaseUrl}/database/${projectId}/collections/${selectedCollection}/documents?${params}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.ok) {
        setDocuments(result.documents);
        setPagination(prev => ({ ...prev, total: result.total }));
      } else {
        setError(result.error || 'Failed to fetch documents');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchDocuments = async () => {
    if (!selectedCollection || !searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        query: searchQuery,
        page: '1',
        limit: pagination.limit.toString()
      });
      
      const response = await fetch(
        `${apiBaseUrl}/database/${projectId}/collections/${selectedCollection}/search?${params}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to search documents: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.ok) {
        setDocuments(result.documents);
        setPagination(prev => ({ ...prev, total: result.total, page: 1 }));
      } else {
        setError(result.error || 'Failed to search documents');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(
        `${apiBaseUrl}/database/${projectId}/collections/${selectedCollection}/documents/${documentId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.ok) {
        fetchDocuments(); // Refresh documents
      } else {
        setError(result.error || 'Failed to delete document');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDocumentSaved = () => {
    setShowEditor(false);
    setEditingDocument(null);
    fetchDocuments(); // Refresh documents
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getDocumentKeys = () => {
    if (documents.length === 0) return [];
    const allKeys = new Set();
    documents.forEach(doc => {
      Object.keys(doc).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  const nextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <DatabaseIcon className="h-5 w-5" />
          <span className="font-medium">Database Error</span>
        </div>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          onClick={fetchCollections}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Collections Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <DatabaseIcon className="h-5 w-5 mr-2" />
            Collections
          </h3>
          <button
            onClick={fetchCollections}
            className="p-1 hover:bg-gray-200 rounded"
            disabled={loading}
          >
            <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-1">
          {collections.map(collection => (
            <button
              key={collection}
              onClick={() => setSelectedCollection(collection)}
              className={`w-full text-left px-3 py-2 rounded flex items-center space-x-2 ${
                selectedCollection === collection 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <TableIcon className="h-4 w-4" />
              <span className="truncate">{collection}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCollection || 'Select a collection'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingDocument(null);
                  setShowEditor(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
                disabled={!selectedCollection}
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Document</span>
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4 flex space-x-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchDocuments()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchDocuments}
              disabled={!searchQuery.trim() || !selectedCollection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Search
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchDocuments();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Document Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2 text-gray-500">
                <RefreshCwIcon className="h-5 w-5 animate-spin" />
                <span>Loading documents...</span>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TableIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No documents found</p>
                {selectedCollection && (
                  <button
                    onClick={() => {
                      setEditingDocument(null);
                      setShowEditor(true);
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Create your first document
                  </button>
                )}
              </div>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {getDocumentKeys().map(key => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <tr key={doc._id || index} className="hover:bg-gray-50">
                    {getDocumentKeys().map(key => (
                      <td key={key} className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={formatValue(doc[key])}>
                          {formatValue(doc[key])}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => {
                          setEditingDocument(doc);
                          setShowEditor(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {documents.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} documents
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {pagination.page}
              </span>
              <button
                onClick={nextPage}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Editor Modal */}
      {showEditor && (
        <DocumentEditor
          projectId={projectId}
          collection={selectedCollection}
          document={editingDocument}
          apiBaseUrl={apiBaseUrl}
          onClose={() => {
            setShowEditor(false);
            setEditingDocument(null);
          }}
          onSave={handleDocumentSaved}
        />
      )}
    </div>
  );
};

export default DatabaseViewer;