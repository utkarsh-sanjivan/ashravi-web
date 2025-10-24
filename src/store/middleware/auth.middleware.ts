import type { Middleware } from '@reduxjs/toolkit';

import { authApi } from '../api/auth.api';
import type { AuthUser } from '@/types/api/auth';
import { clearUser, setUser } from '../user.slice';

const mapUserPayload = (user: AuthUser | undefined) => ({
  id: user?.id ?? null,
  name: user?.name ?? null,
  email: user?.email ?? null,
  role: user?.role ?? null,
  createdAt: user?.createdAt ?? null,
  updatedAt: user?.updatedAt ?? null,
});

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (authApi.endpoints.login.matchFulfilled(action)) {
    store.dispatch(setUser(mapUserPayload(action.payload.user)));
  }

  if (authApi.endpoints.profile.matchFulfilled(action)) {
    store.dispatch(setUser(mapUserPayload(action.payload.user)));
  }

  if (authApi.endpoints.refresh.matchFulfilled(action)) {
    if (action.payload.user) {
      store.dispatch(setUser(mapUserPayload(action.payload.user)));
    }
  }

  if (authApi.endpoints.logout.matchFulfilled(action)) {
    store.dispatch(clearUser());
  }

  if (
    authApi.endpoints.login.matchRejected(action) ||
    authApi.endpoints.profile.matchRejected(action) ||
    authApi.endpoints.refresh.matchRejected(action)
  ) {
    const status = action.payload?.status;
    if (status === 401) {
      store.dispatch(clearUser());
    }
  }

  return next(action);
};
