'use client';

import { useState } from 'react';
import './AuthToggle.css';

export default function AuthToggle() {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const setAuthCookie = (userId: string, userName: string, userEmail: string) => {
    const user = {
      id: userId,
      name: userName,
      email: userEmail,
    };
    document.cookie = `session=${JSON.stringify(user)}; path=/`;
    window.location.reload();
  };

  const clearAuth = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  return (
    <div className="auth-toggle-dev">
      <button 
        className="auth-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔧 Dev Auth
      </button>
      
      {isOpen && (
        <div className="auth-toggle-menu">
          <div className="auth-toggle-header">Development Auth</div>
          <button 
            className="auth-option"
            onClick={() => setAuthCookie('user1', 'Priya Sharma', 'priya.sharma@example.com')}
          >
            Login as Priya Sharma
          </button>
          <button 
            className="auth-option"
            onClick={() => setAuthCookie('user2', 'Rajesh Kumar', 'rajesh.kumar@example.com')}
          >
            Login as Rajesh Kumar
          </button>
          <button 
            className="auth-option logout"
            onClick={clearAuth}
          >
            Logout (Landing Page)
          </button>
        </div>
      )}
    </div>
  );
}
