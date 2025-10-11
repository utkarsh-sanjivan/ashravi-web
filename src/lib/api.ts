const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  requiresAuth?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      // Server-side: Get from cookies via headers
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('accessToken');
      return token?.value || null;
    }
    
    // Client-side: Get from localStorage
    return localStorage.getItem('accessToken') || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, requiresAuth = false, ...fetchOptions } = options;

    let url = `${this.baseURL}${endpoint}`;

    // Add query parameters
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    // Prepare headers - explicitly typed as Record<string, string>
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge any additional headers from options
    if (fetchOptions.headers) {
      const optionHeaders = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, optionHeaders);
    }

    // Add authentication token if required
    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    console.log('🌐 API Request:', {
      method: fetchOptions.method || 'GET',
      url,
      hasAuth: !!headers['Authorization']
    });

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include', // Important for cookies
      });

      console.log('📡 API Response:', {
        status: response.status,
        ok: response.ok,
        url
      });

      // Handle unauthorized - refresh token or redirect to login
      if (response.status === 401 && requiresAuth) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          return this.request<T>(endpoint, options);
        } else {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          throw new Error('Unauthorized');
        }
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ API Error Response:', errorData);
        } catch (e) {
          console.error('❌ API Error (no JSON):', response.statusText);
          errorData = { message: response.statusText };
        }
        
        throw new Error(
          errorData.message || errorData.error || `API Error: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);
      return data as T;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Authentication specific methods
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined' && data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
}

const api = new APIClient(API_BASE);
export default api;
