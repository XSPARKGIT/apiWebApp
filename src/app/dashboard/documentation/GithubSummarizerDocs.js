export default function GithubSummarizerDocs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">GitHub Summarizer API</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Endpoint</h2>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          POST /api/github-summarizer
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Authentication</h2>
        <p>
          All requests must include your API key in the Authorization header:
        </p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          Authorization: Bearer YOUR_API_KEY
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Request Parameters</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">repoUrl</td>
                <td className="border border-gray-300 px-4 py-2">string</td>
                <td className="border border-gray-300 px-4 py-2">URL of the GitHub repository to summarize</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Example Request</h2>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
          <pre>{`curl -X POST https://keymzanzi.com/api/github-summarizer \\
  -H "Authorization: Bearer keymzanziprod_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"repoUrl": "https://github.com/vercel/next.js"}'`}</pre>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Example Response</h2>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
          <pre>{`{
  "success": true,
  "repository": "https://github.com/vercel/next.js",
  "summary": "This is a summary of the Next.js repository...",
  "key_type": "production",
  "timestamp": "2023-10-25T12:34:56.789Z"
}`}</pre>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Error Responses</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Status Code</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Error</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">400</td>
                <td className="border border-gray-300 px-4 py-2">Missing repository URL</td>
                <td className="border border-gray-300 px-4 py-2">The repoUrl parameter is required</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">401</td>
                <td className="border border-gray-300 px-4 py-2">Missing Authorization header</td>
                <td className="border border-gray-300 px-4 py-2">API key was not provided</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">401</td>
                <td className="border border-gray-300 px-4 py-2">Invalid API key format</td>
                <td className="border border-gray-300 px-4 py-2">API key format is incorrect</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">401</td>
                <td className="border border-gray-300 px-4 py-2">Invalid API key</td>
                <td className="border border-gray-300 px-4 py-2">API key does not exist or is inactive</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">500</td>
                <td className="border border-gray-300 px-4 py-2">Internal server error</td>
                <td className="border border-gray-300 px-4 py-2">Something went wrong on the server</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 