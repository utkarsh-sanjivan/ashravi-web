import { PayloadAction, isAnyOf } from '@reduxjs/toolkit';

import { authApi } from '@/store/api/auth.api';
import { createAppSlice } from '@/store/utils/createAppSlice';
import { resolveRejectedActionError } from '@/store/utils/error';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  isAuthenticated: boolean;
  status: LoadingStatus;
  error: string | null;
}

export const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  role: null,
  createdAt: null,
  updatedAt: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<Omit<UserState, 'isAuthenticated' | 'status' | 'error'>>
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.createdAt = null;
      state.updatedAt = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchPending,
          authApi.endpoints.profile.matchPending,
          authApi.endpoints.refresh.matchPending,
          authApi.endpoints.logout.matchPending
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchFulfilled,
          authApi.endpoints.profile.matchFulfilled,
          authApi.endpoints.refresh.matchFulfilled,
          authApi.endpoints.logout.matchFulfilled
        ),
        (state) => {
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchRejected,
          authApi.endpoints.profile.matchRejected,
          authApi.endpoints.refresh.matchRejected,
          authApi.endpoints.logout.matchRejected
        ),
        (state, action) => {
          state.status = 'failed';
          const resolved = resolveRejectedActionError(
            action,
            'Unable to process authentication request'
          );
          state.error = resolved.message;
        }
      );
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
