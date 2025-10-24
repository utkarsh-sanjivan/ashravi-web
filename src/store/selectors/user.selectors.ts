import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { initialState } from '@/store/user.slice';

const selectUserDomain = (state: RootState) => state.user ?? initialState;

export const selectUserProfile = createSelector(selectUserDomain, (user) => user);

export const selectIsAuthenticated = createSelector(
  selectUserDomain,
  (user) => Boolean(user.isAuthenticated)
);

export const selectUserStatus = createSelector(
  selectUserDomain,
  (user) => user.status
);

export const selectUserError = createSelector(
  selectUserDomain,
  (user) => user.error
);
