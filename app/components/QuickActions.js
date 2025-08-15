'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuickActions({ cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        } flex items-center justify-center`}
      >
        <span className="text-2xl font-bold">{isOpen ? '✕' : '⚡'}</span>
      </button>

      {/* Action buttons */}
      {isOpen && (
        <>
          {/* Cart */}
          <Link
            href="/cart"
            className="absolute bottom-16 left-0 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-slide-up"
            style={{ animationDelay: '0.1s' }}
            title={`Cart (${cartCount} items)`}
          >
            <div className="relative">
              🛒
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </div>
          </Link>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute bottom-28 left-2 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-slide-up"
            style={{ animationDelay: '0.2s' }}
            title="Back to top"
          >
            ⬆️
          </button>

          {/* Help */}
          <button
            onClick={() => alert('Need help? Contact support at help@snacksstore.com')}
            className="absolute bottom-40 -left-1 w-10 h-10 bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-slide-up"
            style={{ animationDelay: '0.3s' }}
            title="Help & Support"
          >
            ❓
          </button>
        </>
      )}
    </div>
  );
}