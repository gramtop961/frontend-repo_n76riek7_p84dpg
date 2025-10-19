import { useState } from 'react'
import WorkspacePage from './components/WorkspacePage'

function App() {
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [projectId, setProjectId] = useState('demo-project-123')

  if (showWorkspace) {
    return <WorkspacePage projectId={projectId} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Vibe Coding Platform
        </h1>
        <p className="text-gray-600 mb-6">
          Your AI-powered development environment with MongoDB database viewer
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID:
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project ID"
            />
          </div>
          
          <button
            onClick={() => setShowWorkspace(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Open MongoDB Database Viewer
          </button>
          
          <p className="text-sm text-gray-500 text-center">
            This will open the workspace with database viewer, editor, and validation features.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App