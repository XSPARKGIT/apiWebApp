'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign in to KeyMzanzi</h1>
          <p className="text-gray-600">Manage your API keys and access tokens</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Image
            src="/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>
    </div>
  );
} 