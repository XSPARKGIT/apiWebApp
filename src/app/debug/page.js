import { getServerSession } from "next-auth/next";
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DebugPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Environment</h2>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
        <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Session</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
} 