import Link from 'next/link';
import Image from 'next/image';
import AuthButton from './AuthButton';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                className="h-8 w-auto dark:invert"
                src="/next.svg"
                alt="KeyMzanzi Logo"
                width={100}
                height={24}
                priority
              />
              <span className="ml-2 text-xl font-bold">KeyMzanzi</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/documentation" 
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Docs
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 