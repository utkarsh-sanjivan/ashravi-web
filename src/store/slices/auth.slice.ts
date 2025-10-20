import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authAPI from '@/api/auth';
import storageService from '@/services/storageService';
import logger from '@/services/logger';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Helper function to clear cookie
function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Login thunk
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: authAPI.LoginCredentials, { rejectWithValue }) => {
    try {
      logger.info('Starting login process');
      const response = await authAPI.login(credentials);
      
      // Store in localStorage
      storageService.setAccessToken(response.accessToken);
      storageService.setRefreshToken(response.refreshToken);
      storageService.setUser(response.user);
      
      // Set cookies for server-side access
      setCookie('accessToken', response.accessToken, 7);
      setCookie('refreshToken', response.refreshToken, 7);
      
      logger.success('Login successful');
      return response;
    } catch (error: any) {
      logger.error('Login failed', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Register thunk
 */
export const register = createAsyncThunk(
  'auth/register',
  async (data: authAPI.RegisterData, { rejectWithValue }) => {
    try {
      logger.info('Starting registration process');
      const response = await authAPI.register(data);
      
      logger.success('Registration successful');
      return response;
    } catch (error: any) {
      logger.error('Registration failed', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Logout thunk
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      logger.info('Starting logout process');
      await authAPI.logout();
      
      // Clear localStorage
      storageService.clearAuth();
      
      // Clear cookies
      clearCookie('accessToken');
      clearCookie('refreshToken');
      
      logger.success('Logout successful');
    } catch (error: any) {
      logger.error('Logout failed', error);
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/**
 * Check auth from localStorage on app load
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = storageService.getAccessToken();
      const refreshToken = storageService.getRefreshToken();
      const user = storageService.getUser<User>();
      
      if (!accessToken || !user) {
        throw new Error('No auth data found');
      }
      
      logger.info('Auth restored from localStorage');
      return { accessToken, refreshToken, user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<authAPI.AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      return initialState; // Reset to initial state
    });
    builder.addCase(logout.rejected, (state) => {
      return initialState; // Clear state even on error
    });

    // Check Auth
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
