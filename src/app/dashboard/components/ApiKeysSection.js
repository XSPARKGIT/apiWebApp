'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import CreateKeyModal from './CreateKeyModal';
import EditKeyModal from './EditKeyModal';

export default function ApiKeysSection({ 
  apiKeys, 
  loading, 
  revealKey, 
  toggleRevealKey, 
  maskKey, 
  deleteApiKey, 
  updateApiKey, 
  createApiKey,
  showToast 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  const handleEditClick = (key) => {
    setEditingKey(key);
    setShowEditModal(true);
  };

  const handleDeleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      showToast('API key deleted successfully', 'delete');
    } catch (error) {
      alert('Failed to delete API key.');
    }
  };

  const handleSaveChanges = async (id, updates) => {
    try {
      await updateApiKey(id, updates);
      setShowEditModal(false);
      setEditingKey(null);
      showToast('API key updated successfully', 'success');
    } catch (error) {
      alert('Failed to update API key.');
    }
  };

  const handleCreateKey = async (newKeyData) => {
    try {
      await createApiKey(newKeyData);
      setShowCreateModal(false);
      showToast('API key created successfully', 'success');
    } catch (error) {
      alert('Failed to create API key.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied API Key to clipboard', 'success');
  };

  return (
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateKeyModal 
          onClose={() => setShowCreateModal(false)}
          onCreateKey={handleCreateKey}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingKey && (
        <EditKeyModal 
          key={editingKey.id}
          apiKey={editingKey}
          onClose={() => {
            setShowEditModal(false);
            setEditingKey(null);
          }}
          onSaveChanges={(updates) => handleSaveChanges(editingKey.id, updates)}
        />
      )}
    </div>
  );
} 