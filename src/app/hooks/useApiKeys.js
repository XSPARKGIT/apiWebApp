'use client';
import { useState, useEffect } from 'react';
import { apiKeyService } from '@/src/app/lib/supabaseClient';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealKey, setRevealKey] = useState({});

  async function fetchApiKeys() {
    try {
      setLoading(true);
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
      return data;
    } catch (error) {
      console.error('Error fetching API keys:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createApiKey(newKeyData) {
    try {
      const createdKey = await apiKeyService.createApiKey(newKeyData);
      setApiKeys([createdKey, ...apiKeys]);
      return createdKey;
    } catch (error) {
      console.error('Error creating API key:', error.message);
      setError(error.message);
      throw error;
    }
  }

  async function deleteApiKey(id) {
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error.message);
      setError(error.message);
      throw error;
    }
  }

  async function toggleKeyStatus(id, currentStatus) {
    try {
      const newStatus = await apiKeyService.toggleKeyStatus(id, currentStatus);
      setApiKeys(apiKeys.map(key => 
        key.id === id 
          ? {...key, status: newStatus}
          : key
      ));
      return newStatus;
    } catch (error) {
      console.error('Error updating API key status:', error.message);
      setError(error.message);
      throw error;
    }
  }

  async function updateApiKey(id, updates) {
    try {
      await apiKeyService.updateApiKey(id, updates);
      await fetchApiKeys(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating API key:', error.message);
      setError(error.message);
      throw error;
    }
  }

  // UI-related utility functions
  const toggleRevealKey = (id) => {
    setRevealKey({
      ...revealKey,
      [id]: !revealKey[id]
    });
  };

  const maskKey = (key) => {
    return key.substring(0, 8) + '*'.repeat(key.length - 8);
  };

  // Initialize
  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    revealKey,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
    toggleKeyStatus,
    updateApiKey,
    toggleRevealKey,
    maskKey
  };
} 