'use client';
import { useState } from 'react';
import { FaCheckCircle, FaCode } from 'react-icons/fa';

export default function CreateKeyModal({ onClose, onCreateKey }) {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState('dev');
  const [keyLimit, setKeyLimit] = useState(0);
  const [enableLimit, setEnableLimit] = useState(false);

  const handleCreateKey = () => {
    if (!newKeyName) return;
    
    const newKey = {
      name: newKeyName,
      key: `keymzanzi${newKeyType}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      type: newKeyType,
      usage: enableLimit ? parseInt(keyLimit) : 0,
      status: 'active',
    };

    onCreateKey(newKey);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[600px] max-w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Create a new API key</h2>
        
        <p className="text-gray-600 mb-6">
          Enter a name and usage limit for the new API key.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-baseline gap-2 mb-2">
              <span className="block text-gray-700 font-medium">Key Name</span>
              <span className="text-gray-500 text-sm">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="flex items-baseline gap-2 mb-4">
              <span className="block text-gray-700 font-medium">Key Type</span>
              <span className="text-gray-500 text-sm">— Choose the environment for this key</span>
            </label>
            
            <div className="flex flex-col space-y-3">
              <label className="relative border rounded-lg p-4 flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="keyType"
                  value="prod"
                  checked={newKeyType === 'prod'}
                  onChange={() => setNewKeyType('prod')}
                  className="mr-3 h-5 w-5 text-blue-500"
                />
                <div className="flex items-center gap-3">
                  <span className="text-green-500">
                    <FaCheckCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="font-medium">Production</div>
                    <div className="text-sm text-gray-500">Rate limited to 1,000 requests/minute</div>
                  </div>
                </div>
              </label>
              
              <label className="relative border rounded-lg p-4 flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="keyType"
                  value="dev"
                  checked={newKeyType === 'dev'}
                  onChange={() => setNewKeyType('dev')}
                  className="mr-3 h-5 w-5 text-blue-500"
                />
                <div className="flex items-center gap-3">
                  <span className="text-blue-500">
                    <FaCode className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="font-medium">Development</div>
                    <div className="text-sm text-gray-500">Rate limited to 100 requests/minute</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="limitUsage"
                checked={enableLimit}
                onChange={(e) => setEnableLimit(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="limitUsage" className="text-gray-700 font-medium">
                Set initial usage*
              </label>
            </div>
            <input
              type="number"
              value={keyLimit}
              onChange={(e) => setKeyLimit(e.target.value)}
              placeholder="0"
              disabled={!enableLimit}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={handleCreateKey}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full"
          >
            Create
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