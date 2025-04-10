'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import Toast from '../../components/notifications';
import { apiKeyService } from '@/src/app/lib/supabaseClient';

export default function Playground() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validatingKey, setValidatingKey] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [apiKeys, setApiKeys] = useState([]);

  // Fetch API keys when component mounts
  useEffect(() => {
    async function fetchKeys() {
      try {
        const data = await apiKeyService.fetchApiKeys();
        setApiKeys(data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    }
    
    fetchKeys();
  }, []);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Show toast notification
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Validate if API key exists in the database
  const validateApiKey = (keyToValidate) => {
    return apiKeys.some(k => k.key === keyToValidate && k.status === 'active');
  };

  // Instead of using a string message in the response, create a function that returns JSX
  const getInvalidFormatMessage = () => (
    <span>
      The API key format is invalid. Keys should begin with <code>keymzanziprod_</code> or <code>keymzanzidev_</code> followed by a random string.
    </span>
  );

  // Create another JSX function for the second error message
  const getInvalidKeyMessage = () => (
    <span>
      This API key does not exist or is inactive in our database.
    </span>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey) {
      showToastNotification('Please enter an API key', 'delete');
      return;
    }
    
    // Validate API key
    setValidatingKey(true);
    setResponse(null);
    
    // First check if it follows the expected format
    const keyFormatRegex = /^keymzanzi(prod|dev)_[a-z0-9]{20,}$/;
    if (!keyFormatRegex.test(apiKey)) {
      setValidatingKey(false);
      showToastNotification('Invalid API key format', 'delete');
      
      // Set invalid response
      setResponse({
        valid: false,
        messageJsx: getInvalidFormatMessage(),
        timestamp: new Date().toISOString()
      });
      
      return;
    }
    
    // Then check if it exists in the database
    const isValidKey = validateApiKey(apiKey);
    
    if (!isValidKey) {
      setValidatingKey(false);
      showToastNotification('Invalid API key', 'delete');
      
      // Set invalid response
      setResponse({
        valid: false,
        messageJsx: getInvalidKeyMessage(),
        timestamp: new Date().toISOString()
      });
      
      return;
    }
    
    // If we reach here, the API key is valid
    showToastNotification('Valid API key, can be accessed', 'success');
    
    // Set valid response
    setResponse({
      valid: true,
      message: 'This API key is valid and can be used for API requests.',
      timestamp: new Date().toISOString(),
      details: {
        type: apiKey.startsWith('keymzanziprod_') ? 'Production' : 'Development',
        rateLimit: apiKey.startsWith('keymzanziprod_') ? '1,000 requests/minute' : '100 requests/minute'
      }
    });
    
    setValidatingKey(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          {/* Toast notification component */}
          <Toast 
            show={showToast}
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
          
          <h1 className="text-3xl font-bold mb-6">API Key Validator</h1>
          <p className="text-gray-600 mb-8">
            Validate your API keys to ensure they can be used for accessing the Research API.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Input form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Validate API Key</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key here"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={validatingKey}
                    className={`${
                      validatingKey ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-medium py-2 px-6 rounded-md transition-colors`}
                  >
                    {validatingKey ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Validating API key...</span>
                      </div>
                    ) : (
                      'Validate Key'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Right column - Response display */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Validation Result</h2>
              
              {validatingKey ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="mt-4 text-gray-600">Validating API key...</p>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className={`p-4 ${response.valid ? 'bg-green-50' : 'bg-red-50'} rounded-md`}>
                    <div className="flex items-center mb-2">
                      {response.valid ? (
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <h3 className={`font-medium ${response.valid ? 'text-green-800' : 'text-red-800'}`}>
                        {response.valid ? 'Valid API Key' : 'Invalid API Key'}
                      </h3>
                    </div>
                    {response.messageJsx || <p className="text-gray-700">{response.message}</p>}
                  </div>
                  
                  {response.valid && (
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-800 mb-2">Key Details:</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Type: {response.details.type}</p>
                        <p>Rate Limit: {response.details.rateLimit}</p>
                        <p>Validated at: {new Date(response.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p>Enter an API key and click "Validate Key" to verify it</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Documentation Section */}
          <div className="mt-10 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">API Key Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Key Format</h3>
                <p className="text-gray-600 mb-2">
                  API keys follow a specific format for different environments:
                </p>
                <div className="bg-gray-100 p-3 rounded">
                  <div className="font-mono text-sm mb-2">Development: <span className="text-blue-600">keymzanzidev_[random string]</span></div>
                  <div className="font-mono text-sm">Production: <span className="text-green-600">keymzanziprod_[random string]</span></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Using Your API Key</h3>
                <p className="text-gray-600 mb-2">
                  Once validated, you can use your API key in the authorization header for all API requests:
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Rate Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h4 className="font-medium mb-2 text-blue-600">Development Keys</h4>
                    <p className="text-gray-600">Limited to 100 requests per minute</p>
                    <p className="text-gray-600 text-sm mt-2">Best for testing and development environments</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h4 className="font-medium mb-2 text-green-600">Production Keys</h4>
                    <p className="text-gray-600">Limited to 1,000 requests per minute</p>
                    <p className="text-gray-600 text-sm mt-2">Best for production applications with higher traffic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 