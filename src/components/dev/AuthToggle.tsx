'use client';

import { useState } from 'react';
import './AuthToggle.css';

export default function AuthToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleLogin = async (userId: string, userName: string, userEmail: string) => {
    setIsLoading(true);
    try {
      console.log('🔵 Attempting login:', { userId, userName, userEmail });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: userName,
          email: userEmail,
        }),
      });

      console.log('🔵 Response status:', response.status);
      const data = await response.json();
      console.log('🔵 Response data:', data);

      if (response.ok) {
        console.log('✅ Login successful, reloading page...');
        // Reload the page to reflect the new auth state
        window.location.href = '/';
      } else {
        console.error('🔴 Login failed:', data);
        alert(`Login failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('🔴 Login error:', error);
      alert(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log('🔵 Attempting logout...');
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      console.log('🔵 Logout response status:', response.status);
      const data = await response.json();
      console.log('🔵 Logout response data:', data);

      if (response.ok) {
        console.log('✅ Logout successful, reloading page...');
        // Reload the page to reflect the new auth state
        window.location.href = '/';
      } else {
        console.error('🔴 Logout failed:', data);
        alert(`Logout failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('🔴 Logout error:', error);
      alert(`Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-toggle-dev">
      <button 
        className="auth-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        {isLoading ? '⏳' : '🔧'} Dev Auth
      </button>
      
      {isOpen && (
        <div className="auth-toggle-menu">
          <div className="auth-toggle-header">Development Auth</div>
          <button 
            className="auth-option"
            onClick={() => handleLogin('user1', 'Priya Sharma', 'priya.sharma@example.com')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login as Priya Sharma'}
          </button>
          <button 
            className="auth-option"
            onClick={() => handleLogin('user2', 'Rajesh Kumar', 'rajesh.kumar@example.com')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login as Rajesh Kumar'}
          </button>
          <button 
            className="auth-option logout"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Logout (Landing Page)'}
          </button>
        </div>
      )}
    </div>
  );
}
