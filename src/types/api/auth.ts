export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  occupation?: string;
  city?: string;
  economicStatus?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
}

export interface ProfileResponse {
  user: AuthUser;
}

export interface RefreshResponse {
  success: boolean;
  user?: AuthUser;
}
