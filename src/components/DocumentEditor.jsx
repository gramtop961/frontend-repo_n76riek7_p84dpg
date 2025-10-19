import React, { useState, useEffect } from 'react';
import { XIcon, SaveIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

const DocumentEditor = ({ projectId, collection, document, apiBaseUrl, onClose, onSave }) => {
  const [jsonContent, setJsonContent] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize content
    if (document) {
      // Editing existing document - exclude _id from editable content
      const { _id, ...editableContent } = document;
      setJsonContent(JSON.stringify(editableContent, null, 2));
    } else {
      // Creating new document
      setJsonContent('{\n  \n}');
    }
  }, [document]);

  const validateJson = () => {
    try {
      JSON.parse(jsonContent);
      return true;
    } catch (error) {
      setError(`Invalid JSON: ${error.message}`);
      return false;
    }
  };

  const validateWithSchema = async () => {
    if (!validateJson()) return false;
    
    try {
      setValidating(true);
      setError(null);
      
      const documentData = JSON.parse(jsonContent);
      const response = await fetch(
        `${apiBaseUrl}/database/${projectId}/collections/${collection}/validate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(documentData)
        }
      );

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.ok) {
        setIsValid(result.valid);
        setValidationErrors(result.errors || []);
        return result.valid;
      } else {
        setError(result.error || 'Validation failed');
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    if (!validateJson()) return;
    
    // Validate with schema first
    const isSchemaValid = await validateWithSchema();
    if (!isSchemaValid) return;

    try {
      setSaving(true);
      setError(null);
      
      const documentData = JSON.parse(jsonContent);
      let response;

      if (document) {
        // Update existing document
        response = await fetch(
          `${apiBaseUrl}/database/${projectId}/collections/${collection}/documents/${document._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(documentData)
          }
        );
      } else {
        // Create new document
        response = await fetch(
          `${apiBaseUrl}/database/${projectId}/collections/${collection}/documents`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(documentData)
          }
        );
      }

      if (!response.ok) {
        throw new Error(`Save failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.ok) {
        onSave();
      } else {
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
          setIsValid(false);
        } else {
          setError(result.error || 'Save failed');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatJsonContent = () => {
    if (!validateJson()) return;
    
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // Already handled in validateJson
    }
  };

  const addField = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      parsed.newField = '';
      setJsonContent(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // If JSON is invalid, add to empty object
      setJsonContent('{\n  "newField": ""\n}');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {document ? `Edit Document` : 'New Document'} - {collection}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Validation Status */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {validating ? (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                  <span className="text-sm">Validating...</span>
                </div>
              ) : isValid && validationErrors.length === 0 ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-sm">Valid</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span className="text-sm">
                    {validationErrors.length} validation error(s)
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={formatJsonContent}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Format JSON
              </button>
              <button
                onClick={addField}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Add Field
              </button>
              <button
                onClick={validateWithSchema}
                disabled={validating}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50"
              >
                Validate
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center space-x-2 text-red-700 mb-2">
              <AlertTriangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Validation Errors</span>
            </div>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">
                  <span className="font-medium">{error.field}:</span> {error.message}
                  {error.value !== undefined && (
                    <span className="text-gray-500 ml-2">(got: {JSON.stringify(error.value)})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* JSON Editor */}
        <div className="flex-1 p-4">
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="w-full h-full font-mono text-sm border border-gray-300 rounded p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter JSON document..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {document && (
              <span>Document ID: <code className="bg-gray-100 px-2 py-1 rounded">{document._id}</code></span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !jsonContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <SaveIcon className="h-4 w-4" />
              <span>{saving ? 'Saving...' : (document ? 'Update' : 'Create')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;