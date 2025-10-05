import { cookies } from 'next/headers';

export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock function - replace with actual auth logic
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    return null;
  }

  // TODO: Replace with actual session validation
  // For now, return mock user if session exists
  try {
    const userData = JSON.parse(sessionCookie.value);
    return userData;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}
