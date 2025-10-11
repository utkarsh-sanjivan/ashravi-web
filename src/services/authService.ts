import api from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  occupation?: string;
  city?: string;
  economicStatus?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken?: string; // Added refresh token
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting login process...');
      console.log('📤 Login credentials:', { email: credentials.email });
      
      const response = await api.post<any>('/auth/login', credentials);
      
      console.log('📥 LOGIN - Raw API Response:', response);
      console.log('📥 LOGIN - Response type:', typeof response);
      console.log('📥 LOGIN - Response keys:', response ? Object.keys(response) : 'null');
      
      // Check what structure we got
      let accessToken = null;
      let refreshToken = null;
      let userData = null;
      let normalizedResponse: AuthResponse;

      // Try to extract tokens from different possible locations
      if (response?.data?.accessToken) {
        console.log('✅ Found token at response.data.accessToken');
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        userData = response.data.user;
      } else if (response?.accessToken) {
        console.log('✅ Found token at response.accessToken');
        accessToken = response.accessToken;
        refreshToken = response.refreshToken;
        userData = response.user || response.data?.user;
      } else if (response?.token) {
        console.log('✅ Found token at response.token');
        accessToken = response.token;
        refreshToken = response.refreshToken;
        userData = response.user || response.data?.user;
      } else if (response?.data?.token) {
        console.log('✅ Found token at response.data.token');
        accessToken = response.data.token;
        refreshToken = response.data.refreshToken;
        userData = response.data.user;
      }

      console.log('🔑 Extracted access token:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NONE');
      console.log('🔄 Extracted refresh token:', refreshToken ? `${refreshToken.substring(0, 30)}...` : 'NONE');
      console.log('👤 Extracted user:', userData);

      if (!accessToken) {
        console.error('❌ NO TOKEN FOUND IN RESPONSE!');
        console.error('📋 Full response structure:', JSON.stringify(response, null, 2));
        throw new Error('No access token in response');
      }

      // Normalize response structure
      normalizedResponse = {
        success: response.success !== false,
        message: response.message || 'Login successful',
        data: {
          user: userData || {
            id: '',
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'user'
          },
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      };

      // CRITICAL: Store in localStorage
      if (typeof window !== 'undefined') {
        console.log('💾 Attempting to store in localStorage...');
        
        try {
          // Store access token
          localStorage.setItem('accessToken', accessToken);
          console.log('✅ Access token stored in localStorage');
          
          // Store refresh token if available
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
            console.log('✅ Refresh token stored in localStorage');
          }
          
          // Store user data
          const userJson = JSON.stringify(normalizedResponse.data.user);
          localStorage.setItem('user', userJson);
          console.log('✅ User stored in localStorage');
          
          // VERIFY storage immediately
          const storedAccessToken = localStorage.getItem('accessToken');
          const storedRefreshToken = localStorage.getItem('refreshToken');
          const storedUser = localStorage.getItem('user');
          
          console.log('🔍 VERIFICATION - Access token in localStorage:', storedAccessToken ? `${storedAccessToken.substring(0, 30)}...` : 'NOT FOUND');
          console.log('🔍 VERIFICATION - Refresh token in localStorage:', storedRefreshToken ? `${storedRefreshToken.substring(0, 30)}...` : 'NOT FOUND');
          console.log('🔍 VERIFICATION - User in localStorage:', storedUser ? 'FOUND' : 'NOT FOUND');
          
          if (!storedAccessToken) {
            console.error('❌ CRITICAL: Access token was NOT stored in localStorage!');
          }
        } catch (storageError) {
          console.error('❌ localStorage storage error:', storageError);
        }
      } else {
        console.warn('⚠️ Window is undefined - cannot store in localStorage');
      }
      
      return normalizedResponse;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Register new user with optional parent details
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Starting registration process...');
      console.log('📤 Registration data:', { ...data, password: '***' });
      
      const response = await api.post<any>('/auth/register', data);
      
      console.log('📥 REGISTER - Raw API Response:', response);
      console.log('📥 REGISTER - Response type:', typeof response);
      console.log('📥 REGISTER - Response keys:', response ? Object.keys(response) : 'null');

      // Try to extract tokens from different possible locations
      let accessToken = null;
      let refreshToken = null;
      let userData = null;
      let normalizedResponse: AuthResponse;

      if (response?.data?.accessToken) {
        console.log('✅ Found token at response.data.accessToken');
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        userData = response.data.user;
      } else if (response?.accessToken) {
        console.log('✅ Found token at response.accessToken');
        accessToken = response.accessToken;
        refreshToken = response.refreshToken;
        userData = response.user || response.data?.user;
      } else if (response?.token) {
        console.log('✅ Found token at response.token');
        accessToken = response.token;
        refreshToken = response.refreshToken;
        userData = response.user || response.data?.user;
      } else if (response?.data?.token) {
        console.log('✅ Found token at response.data.token');
        accessToken = response.data.token;
        refreshToken = response.data.refreshToken;
        userData = response.data.user;
      }

      console.log('🔑 Extracted access token:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NONE');
      console.log('🔄 Extracted refresh token:', refreshToken ? `${refreshToken.substring(0, 30)}...` : 'NONE');
      console.log('👤 Extracted user:', userData);

      // For registration, token might not be returned (user needs to login)
      if (!accessToken) {
        console.warn('⚠️ No token in registration response - user will need to login');
        normalizedResponse = {
          success: true,
          message: response.message || 'Registration successful',
          data: {
            user: userData || {
              id: '',
              name: data.name,
              email: data.email,
              role: 'user'
            },
            accessToken: '', // Empty token
            refreshToken: undefined
          }
        };
      } else {
        normalizedResponse = {
          success: response.success !== false,
          message: response.message || 'Registration successful',
          data: {
            user: userData || {
              id: '',
              name: data.name,
              email: data.email,
              role: 'user'
            },
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        };

        // Store in localStorage only if token exists
        if (typeof window !== 'undefined') {
          console.log('💾 Attempting to store registration data in localStorage...');
          
          try {
            localStorage.setItem('accessToken', accessToken);
            console.log('✅ Access token stored in localStorage after registration');
            
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
              console.log('✅ Refresh token stored in localStorage after registration');
            }
            
            const userJson = JSON.stringify(normalizedResponse.data.user);
            localStorage.setItem('user', userJson);
            console.log('✅ User stored in localStorage after registration');
            
            // VERIFY storage immediately
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            const storedUser = localStorage.getItem('user');
            
            console.log('🔍 VERIFICATION - Access token in localStorage:', storedAccessToken ? `${storedAccessToken.substring(0, 30)}...` : 'NOT FOUND');
            console.log('🔍 VERIFICATION - Refresh token in localStorage:', storedRefreshToken ? `${storedRefreshToken.substring(0, 30)}...` : 'NOT FOUND');
            console.log('🔍 VERIFICATION - User in localStorage:', storedUser ? 'FOUND' : 'NOT FOUND');
          } catch (storageError) {
            console.error('❌ localStorage storage error:', storageError);
          }
        }
      }
      
      return normalizedResponse;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error message:', error.message);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    console.log('🚪 Starting logout process...');
    
    try {
      await api.post('/auth/logout', {}, { requiresAuth: true });
      console.log('✅ Logout API call successful');
    } catch (error) {
      console.error('⚠️ Logout API error (continuing with local cleanup):', error);
    } finally {
      // Clear all storage regardless of API call success
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        console.log('🗑️ Cleared localStorage');
        
        // Clear cookies
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        console.log('🗑️ Cleared cookies');
        
        // Redirect to landing page (root with no auth will show landing page)
        console.log('🚀 Redirecting to landing page...');
        window.location.href = '/';
      }
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<{ success: boolean; data: UserProfile }>(
        '/auth/profile',
        { requiresAuth: true }
      );
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await api.put<{ success: boolean; data: UserProfile }>(
        '/auth/profile',
        data,
        { requiresAuth: true }
      );
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put(
        '/auth/change-password',
        { currentPassword, newPassword },
        { requiresAuth: true }
      );
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('⚠️ No refresh token available');
        return false;
      }

      console.log('🔄 Attempting to refresh access token...');
      const response = await api.post<any>('/auth/refresh', { refreshToken });

      if (response && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        
        // Update refresh token if a new one is provided
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
        console.log('✅ Token refreshed successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      console.log('⚠️ isAuthenticated called on server - returning false');
      return false;
    }
    const token = localStorage.getItem('accessToken');
    console.log('🔍 isAuthenticated check:', {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });
    return !!token;
  }

  /**
   * Get stored user data
   */
  getStoredUser(): UserProfile | null {
    if (typeof window === 'undefined') {
      console.log('⚠️ getStoredUser called on server - returning null');
      return null;
    }
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('❌ No user in localStorage');
      return null;
    }
    try {
      const user = JSON.parse(userStr);
      console.log('✅ User from localStorage:', user);
      return user;
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
