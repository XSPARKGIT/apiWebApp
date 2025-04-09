'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { apiKeyService } from '@/src/app/lib/supabaseClient';

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState('dev');
  const [revealKey, setRevealKey] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyLimit, setEditKeyLimit] = useState(1000);
  const [enablePiiRestrictions, setEnablePiiRestrictions] = useState(false);
  const [editKeyName, setEditKeyName] = useState('');

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      setLoading(true);
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error.message);
      alert('Failed to fetch API keys.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!newKeyName) return;
    
    try {
      const newKey = {
        name: newKeyName,
        key: `keymzanzi${newKeyType}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        type: newKeyType,
        usage: 0,
        status: 'active'
      };

      const createdKey = await apiKeyService.createApiKey(newKey);
      
      // Add the new key to the list
      setApiKeys([createdKey, ...apiKeys]);
      setNewKeyName('');
      setNewKeyType('dev');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating API key:', error.message);
      alert('Failed to create API key.');
    }
  }

  async function handleDeleteKey(id) {
    try {
      await apiKeyService.deleteApiKey(id);
      
      // Remove the deleted key from the list
      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error.message);
      alert('Failed to delete API key.');
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      const newStatus = await apiKeyService.toggleKeyStatus(id, currentStatus);
      
      // Update the key status in the list
      setApiKeys(apiKeys.map(key => 
        key.id === id 
          ? {...key, status: newStatus}
          : key
      ));
    } catch (error) {
      console.error('Error updating API key status:', error.message);
      alert('Failed to update API key status.');
    }
  }

  const handleEditClick = (key) => {
    setEditingKey(key);
    setEditKeyLimit(1000); // Default value or could be from the key object if you track this
    setEnablePiiRestrictions(false); // Default value
    setShowEditModal(true);
    setEditKeyName(key.name);
  };

  async function handleSaveChanges() {
    if (!editingKey) return;
    
    try {
      const updates = {
        name: editKeyName,
        // Add other fields that can be edited here
        // For example: monthly_limit: editKeyLimit
      };
      
      await apiKeyService.updateApiKey(editingKey.id, updates);
      
      // Refresh API keys to get the updated data
      await fetchApiKeys();
      
      setShowEditModal(false);
      setEditingKey(null);
    } catch (error) {
      console.error('Error updating API key:', error.message);
      alert('Failed to update API key.');
    }
  }

  // The rest of your component code remains the same...
  
  // These utility functions don't need to be moved to supabaseClient as they're UI-related
  const toggleRevealKey = (id) => {
    setRevealKey({
      ...revealKey,
      [id]: !revealKey[id]
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const maskKey = (key) => {
    return key.substring(0, 8) + '*'.repeat(key.length - 8);
  };

  // The JSX return remains the same...
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Gradient Info Card */}
      <div className="mb-8 p-8 rounded-lg" style={{
        background: 'linear-gradient(135deg, #f5a88e 0%, #a57bcd 100%)',
        color: 'white'
      }}>
        <div className="flex justify-between mb-4">
          <div className="uppercase text-sm font-bold opacity-80">Current Plan</div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-1 rounded-md flex items-center">
            <span>Manage Plan</span>
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-6">Researcher</h1>
        
        <div>
          <div className="flex items-center mb-2">
            <div className="font-semibold mr-2">API Usage</div>
            <div className="text-white opacity-70 cursor-help">ⓘ</div>
          </div>
          <div className="mb-1 flex justify-between">
            <div>Plan</div>
            <div>0 / 1,000 Credits</div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-white mr-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
            <div>Pay as you go</div>
            <div className="text-white opacity-70 cursor-help ml-2">ⓘ</div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Keys</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 border border-gray-300 rounded p-1 px-2 text-gray-700 hover:bg-gray-100"
          >
            <FaPlus size={14} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
        </p>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading API keys...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      No API keys found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.usage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                        {revealKey[key.id] ? key.key : maskKey(key.key)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => toggleRevealKey(key.id)} 
                            className="text-gray-500 hover:text-gray-700"
                            title={revealKey[key.id] ? "Hide key" : "Reveal key"}
                          >
                            {revealKey[key.id] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Copy to clipboard"
                          >
                            <FaCopy />
                          </button>
                          <button 
                            onClick={() => handleEditClick(key)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Edit key"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Delete key"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingKey && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[600px] max-w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Edit API key</h2>
            
            <p className="text-gray-600 mb-6">
              Edit key name, set a new limit for the API key, and configure PII restrictions.
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
                        {editingKey.type === 'dev' ? 'Development' : 'Production'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rate limited to {editingKey.type === 'dev' ? '100' : '1,000'} requests/minute
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <label className="text-gray-700 font-medium">
                    Limit monthly usage*
                  </label>
                </div>
                <input
                  type="number"
                  value={editKeyLimit}
                  onChange={(e) => setEditKeyLimit(e.target.value)}
                  placeholder="1000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
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
                onClick={() => {
                  setShowEditModal(false);
                  setEditingKey(null);
                }}
                className="text-gray-600 font-medium py-2 px-6 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[600px] max-w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Create a new API key</h2>
            
            <p className="text-gray-600 mb-6">
              Enter a name and limit for the new API key.
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
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
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="limitUsage" className="text-gray-700 font-medium">
                    Limit monthly usage*
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
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
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyName('');
                }}
                className="text-gray-600 font-medium py-2 px-6 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}