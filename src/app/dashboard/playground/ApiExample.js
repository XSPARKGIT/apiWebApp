// Example of how to use the API from a client
const testApiEndpoint = async (apiKey, repoUrl) => {
  try {
    const response = await fetch('/api/github-summarizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ repoUrl })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}; 