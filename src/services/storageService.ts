/**
 * Storage Service
 * Centralized localStorage/sessionStorage management
 */

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
} as const;

class StorageService {
  /**
   * Check if localStorage is available
   */
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Get item from localStorage
   */
  get<T = string>(key: string): T | null {
    if (!this.isAvailable()) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Try to parse as JSON, return as string if fails
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  set(key: string, value: any): void {
    if (!this.isAvailable()) return;
    
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  clear(): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Auth-specific methods
   */
  getAccessToken(): string | null {
    return this.get<string>(KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    this.set(KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.get<string>(KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.set(KEYS.REFRESH_TOKEN, token);
  }

  getUser<T = any>(): T | null {
    return this.get<T>(KEYS.USER);
  }

  setUser(user: any): void {
    this.set(KEYS.USER, user);
  }

  clearAuth(): void {
    this.remove(KEYS.ACCESS_TOKEN);
    this.remove(KEYS.REFRESH_TOKEN);
    this.remove(KEYS.USER);
  }
}

export const storageService = new StorageService();
export default storageService;
