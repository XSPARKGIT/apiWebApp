import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center min-h-[calc(100vh-4rem)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome to KeyMzanzi</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Secure API key management for your applications
          </p>
        </div>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Generate and manage API keys for your services
          </li>
          <li className="mb-2 tracking-[-.01em]">
            Monitor API key usage and analytics
          </li>
          <li className="tracking-[-.01em]">
            Secure your API endpoints with authentication
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/api/auth/signin/google"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              Get Started
            </Link>
          )}
          
          <Link
            href="/dashboard/documentation"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            Read Documentation
          </Link>
        </div>
      </main>

      <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-auto">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard/documentation"
        >
          Documentation
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/yourusername/keymzanzi"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
