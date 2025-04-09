import { useEffect } from 'react';

export default function Toast({ 
  show, 
  message, 
  type = 'success', 
  onClose,
  autoClose = true,
  duration = 3000
}) {
  useEffect(() => {
    let timer;
    if (show && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 flex items-center text-white px-4 py-3 rounded-md shadow-md transition-opacity duration-300 ${
        type === 'delete' ? 'bg-red-600' : 'bg-green-600'
      }`}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-white"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
}
