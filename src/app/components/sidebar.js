'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChevronDown, FaChevronRight, FaHome, FaUser, FaCode, FaBook, FaFileAlt, FaExternalLinkAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 border border-gray-200 z-10 shadow-md"
      >
        {isCollapsed ? <FaBars size={14} /> : <FaTimes size={14} />}
      </button>
      
      {/* Logo */}
      <div className="p-6 flex justify-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex items-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 6L6 18L13.5 30" stroke="#FF725C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22.5 6L30 18L22.5 30" stroke="#4299E1" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M18 4.5L18 31.5" stroke="#F6AD55" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {!isCollapsed && <span className="ml-2 text-2xl font-bold text-gray-800">keymzanzi</span>}
          </div>
        </Link>
      </div>
      
      {/* Personal dropdown - hide text when collapsed */}
      {!isCollapsed && (
        <div className="px-4 mb-6">
          <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs mr-2">P</span>
              <span>Personal</span>
            </div>
            <FaChevronDown size={12} />
          </button>
        </div>
      )}
      
      {/* Just the icon when collapsed */}
      {isCollapsed && (
        <div className="px-4 mb-6 flex justify-center">
          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">P</span>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link 
          href="/dashboard" 
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 text-sm font-medium rounded-md ${
            pathname === '/dashboard' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaHome className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
          {!isCollapsed && "Overview"}
        </Link>
        
        {/* My Account - simplified when collapsed */}
        {isCollapsed ? (
          <Link
            href="/dashboard/profile"
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100`}
          >
            <FaUser className="h-4 w-4" />
          </Link>
        ) : (
          <div>
            <button 
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center">
                <FaUser className="mr-3 h-4 w-4" />
                My Account
              </div>
              {accountMenuOpen ? <FaChevronDown className="h-3 w-3" /> : <FaChevronRight className="h-3 w-3" />}
            </button>
            
            {accountMenuOpen && (
              <div className="pl-11 mt-1 space-y-1">
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link 
                  href="/dashboard/billing" 
                  className="block px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                >
                  Billing
                </Link>
              </div>
            )}
          </div>
        )}
        
        <Link 
          href="/dashboard/playground" 
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 text-sm font-medium rounded-md ${
            pathname === '/dashboard/playground' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaCode className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
          {!isCollapsed && "API Playground"}
        </Link>
        
        <Link 
          href="/dashboard/use-cases" 
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 text-sm font-medium rounded-md ${
            pathname === '/dashboard/use-cases' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaBook className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
          {!isCollapsed && "Use Cases"}
        </Link>
        
        <Link 
          href="/dashboard/documentation" 
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 text-sm font-medium rounded-md ${
            pathname === '/dashboard/documentation' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaFileAlt className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
          {!isCollapsed && (
            <>
              Documentation
              <FaExternalLinkAlt className="ml-2 h-3 w-3" />
            </>
          )}
        </Link>
      </nav>
      
      {/* User profile - simplified when collapsed */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full">
            <span>X</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">X Spark ATx</p>
              </div>
              <FaExternalLinkAlt className="ml-auto h-3 w-3 text-gray-400" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
