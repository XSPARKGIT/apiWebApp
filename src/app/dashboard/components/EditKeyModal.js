'use client';
import { useState } from 'react';

export default function EditKeyModal({ apiKey, onClose, onSaveChanges }) {
  const [editKeyName, setEditKeyName] = useState(apiKey.name);
  const [editKeyLimit, setEditKeyLimit] = useState(apiKey.usage || 0);
  const [enablePiiRestrictions, setEnablePiiRestrictions] = useState(false);

  const handleSaveChanges = () => {
    const updates = {
      name: editKeyName,
      usage: parseInt(editKeyLimit)
    };
    
    onSaveChanges(updates);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[600px] max-w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Edit API key</h2>
        
        <p className="text-gray-600 mb-6">
          Edit key name, set a new usage limit for the API key, and configure options.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-baseline gap-2 mb-2">
              <span className="block text-gray-700 font-medium">Key Name</span>
              <span className="text-gray-500 text-sm">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={editKeyName}
              onChange={(e) => setEditKeyName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="flex items-baseline gap-2 mb-4">
              <span className="block text-gray-700 font-medium">Key Type</span>
              <span className="text-gray-500 text-sm">— Environment for this key</span>
            </label>
            
            <div className="border rounded-lg p-4 flex items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                <div>
                  <div className="font-medium">
                    {apiKey.type === 'dev' ? 'Development' : 'Production'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Rate limited to {apiKey.type === 'dev' ? '100' : '1,000'} requests/minute
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <label className="text-gray-700 font-medium">
                Usage limit*
              </label>
            </div>
            <input
              type="number"
              value={editKeyLimit}
              onChange={(e) => setEditKeyLimit(e.target.value)}
              placeholder="1000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="piiRestrictions"
                checked={enablePiiRestrictions}
                onChange={(e) => setEnablePiiRestrictions(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="piiRestrictions" className="text-gray-700 font-medium">
                Enable PII Restrictions
              </label>
              <span className="text-gray-500 text-sm ml-2">— Configure how to handle Personal Identifiable Information (PII) in user queries</span>
            </div>
            <p className="text-xs text-gray-400">* Feature coming soon</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 font-medium py-2 px-6 rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 