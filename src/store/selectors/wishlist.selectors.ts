import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { initialState } from '@/store/wishlist.slice';

const selectWishlistDomain = (state: RootState) => state.wishlist ?? initialState;

export const selectWishlistCourseIds = createSelector(
  selectWishlistDomain,
  (wishlist) => wishlist.courseIds
);

export const selectWishlistPendingMap = createSelector(
  selectWishlistDomain,
  (wishlist) => wishlist.pending
);

export const selectWishlistStatus = createSelector(
  selectWishlistDomain,
  (wishlist) => wishlist.status
);

export const selectWishlistError = createSelector(
  selectWishlistDomain,
  (wishlist) => wishlist.error
);

export const makeSelectIsCourseWishlisted = () =>
  createSelector(
    [selectWishlistCourseIds, (_: RootState, courseId: string) => courseId],
    (ids, courseId) => ids.includes(courseId)
  );

export const makeSelectIsWishlistPending = () =>
  createSelector(
    [selectWishlistPendingMap, (_: RootState, courseId: string) => courseId],
    (pending, courseId) => Boolean(pending[courseId])
  );
