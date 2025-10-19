import React, { useState } from 'react';
import { DatabaseIcon, CodeIcon, SettingsIcon, FileTextIcon } from 'lucide-react';
import DatabaseViewer from './DatabaseViewer';

const WorkspacePage = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('database');

  const tabs = [
    { id: 'database', name: 'Database', icon: DatabaseIcon },
    { id: 'code', name: 'Code Editor', icon: CodeIcon },
    { id: 'files', name: 'Files', icon: FileTextIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'database':
        return (
          <div className="h-full">
            <DatabaseViewer projectId={projectId} />
          </div>
        );
      case 'code':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <CodeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Code Editor</h3>
              <p className="text-gray-400">Code editor functionality would go here</p>
            </div>
          </div>
        );
      case 'files':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">File Manager</h3>
              <p className="text-gray-400">File management functionality would go here</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Project Settings</h3>
              <p className="text-gray-400">Settings would go here</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Workspace
              </h1>
              <span className="text-sm text-gray-500">
                Project: {projectId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[calc(100vh-200px)]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;