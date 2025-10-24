import { env } from '@/config/env';
import { apiService } from '@/services/api.service';
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ProfileResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/api/auth';

const normalizeUser = (payload: any): AuthUser => ({
  id: payload?.id ?? payload?._id ?? '',
  name: payload?.name ?? payload?.fullName ?? '',
  email: payload?.email ?? '',
  role: payload?.role ?? 'user',
  createdAt: payload?.createdAt,
  updatedAt: payload?.updatedAt,
});

export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: any): LoginResponse => ({
        success: Boolean(response?.success ?? true),
        message: response?.message,
        user: normalizeUser(response?.user ?? response?.data?.user ?? {}),
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: any): LogoutResponse => ({
        success: Boolean(response?.success ?? true),
        message: response?.message,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: `${env.NEXT_PUBLIC_API_BASE}/auth/register`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any): RegisterResponse => ({
        success: Boolean(response?.success ?? response?.data?.success ?? true),
        message: response?.message,
        user: normalizeUser(response?.data?.user ?? response?.user ?? payloadFallback(response)),
      }),
    }),
    profile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
      transformResponse: (response: any): ProfileResponse => ({
        user: normalizeUser(response?.user ?? response?.data?.user ?? {}),
      }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: any): RefreshResponse => ({
        success: Boolean(response?.success ?? true),
        user: response?.user ? normalizeUser(response.user) : undefined,
      }),
    }),
  }),
  overrideExisting: true,
});

function payloadFallback(response: any): AuthUser {
  const source = response?.data ?? response ?? {};
  return normalizeUser({
    id: source?.id,
    name: source?.name,
    email: source?.email,
    role: source?.role,
    createdAt: source?.createdAt,
    updatedAt: source?.updatedAt,
  });
}

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileQuery,
  useRefreshMutation,
  useLazyProfileQuery,
} = authApi;
