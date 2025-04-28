'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const isAuthenticated = status === 'authenticated';
  const isSessionLoading = status === 'loading';

  const handleSignIn = async () => {
    setIsButtonLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsButtonLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <button 
        disabled
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-gray-100 dark:bg-gray-800 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
      >
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image 
            src={session.user.image} 
            width={32} 
            height={32} 
            alt={session.user.name || "User"} 
            className="rounded-full"
          />
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium truncate max-w-[100px]">
            {session.user.name?.split(' ')[0] || 'User'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isButtonLoading}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
        >
          {isButtonLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isButtonLoading}
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
    >
      <Image
        src="/google-logo.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-1"
      />
      {isButtonLoading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
} 