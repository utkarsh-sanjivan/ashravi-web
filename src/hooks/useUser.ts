'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  children: string[];
  enrolledCourses: string[];
  wishlist: string[];
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate it
    const fetchUser = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/me');
        // const data = await response.json();
        
        // Mock user data for development
        const mockUser: User = {
          id: 'user1',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          role: 'parent',
          avatar: '/images/testimonials/avatar1.jpg',
          children: ['child1', 'child2'],
          enrolledCourses: ['1', '2'],
          wishlist: ['3'],
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
