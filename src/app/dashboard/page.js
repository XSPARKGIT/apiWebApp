'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar';
import Toast from '../components/notifications';
import ApiKeysSection from './components/ApiKeysSection';
import UsageInfoCard from './components/UsageInfoCard';
import { useApiKeys } from '../hooks/useApiKeys';

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  const { 
    apiKeys, 
    loading, 
    revealKey, 
    createApiKey, 
    deleteApiKey, 
    updateApiKey, 
    toggleRevealKey, 
    maskKey 
  } = useApiKeys();

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
          
          {/* Usage info card */}
          <UsageInfoCard />

          {/* API Keys Section */}
          <ApiKeysSection 
            apiKeys={apiKeys}
            loading={loading}
            revealKey={revealKey}
            toggleRevealKey={toggleRevealKey}
            maskKey={maskKey}
            deleteApiKey={deleteApiKey}
            updateApiKey={updateApiKey}
            createApiKey={createApiKey}
            showToast={showToastNotification}
          />
        </div>
      </div>
    </div>
  );
}