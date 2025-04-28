import { NextResponse } from 'next/server';
import { apiKeyService } from '@/src/app/lib/supabaseClient';
import { generateGitHubSummary } from '@/src/app/lib/chain';

export async function POST(request) {
  try {
    // Extract the API key from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    // Check if Authorization header exists
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      );
    }
    
    // Helper function to get README content from GitHub repo URL
    async function getReadmeContent(repoUrl) {
      try {
        console.log(`[GitHub API] Attempting to fetch README from: ${repoUrl}`);
        
        // Extract owner and repo name from URL
        const urlParts = repoUrl.replace('https://github.com/', '').split('/');
        const [owner, repo] = urlParts;
        
        console.log(`[GitHub API] Parsed owner: ${owner}, repo: ${repo}`);
        
        // Fetch README from GitHub API
        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        console.log(`[GitHub API] Requesting README from: ${readmeUrl}`);
        
        const response = await fetch(readmeUrl);
        
        console.log(`[GitHub API] Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[GitHub API ERROR] Failed to fetch README: ${errorText}`);
          throw new Error(`Failed to fetch README: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`[GitHub API] Successfully retrieved README metadata. Size: ${data.size} bytes`);
        
        // Content is base64 encoded
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        console.log(`[GitHub API] Successfully decoded README content. Length: ${content.length} chars`);
        
        return content;
      } catch (error) {
        console.error(`[GitHub API ERROR] ${error.message}`);
        console.error(`[GitHub API ERROR STACK] ${error.stack}`);
        throw error;
      }
    }
    
    const apiKey = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    // Validate API key format
    const keyFormatRegex = /^keymzanzi(prod|dev)_[a-z0-9]{20,}$/;
    if (!keyFormatRegex.test(apiKey)) {
      return NextResponse.json(
        { 
          error: 'Invalid API key format',
          details: 'API keys should begin with "keymzanziprod_" or "keymzanzidev_" followed by a random string'
        },
        { status: 401 }
      );
    }
    
    // Fetch all API keys to validate against database
    const apiKeys = await apiKeyService.fetchApiKeys();
    
    // Validate if API key exists and is active
    const isValidKey = apiKeys.some(k => k.key === apiKey && k.status === 'active');
    
    if (!isValidKey) {
      return NextResponse.json(
        { 
          error: 'Invalid API key',
          details: 'This API key does not exist or is inactive'
        },
        { status: 401 }
      );
    }
    
    // If we got here, the API key is valid
    // Now parse the request body
    const body = await request.json();
    const { repoUrl } = body;
    
    // Check if GitHub repo URL is provided
    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Missing repository URL' },
        { status: 400 }
      );
    }
    
    try {
      console.log(`[API] Processing request for repository: ${repoUrl}`);
      
      // Actually fetch the README content
      const readmeContent = await getReadmeContent(repoUrl);
      
      // Use LangChain to generate a summary
      const summary = await generateGitHubSummary(readmeContent);
      
      console.log(`[API] Successfully generated summary for: ${repoUrl}`);
      
      return NextResponse.json({
        success: true,
        repository: repoUrl,
        summary: summary.summary,
        cool_facts: summary.cool_facts,
        content_length: readmeContent.length,
        key_type: apiKey.startsWith('keymzanziprod_') ? 'production' : 'development',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`[API ERROR] Error processing GitHub repo: ${error.message}`);
      return NextResponse.json(
        { 
          error: 'GitHub repository processing failed', 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API CRITICAL ERROR]:', error);
    console.error(`[API ERROR STACK] ${error.stack}`);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 

