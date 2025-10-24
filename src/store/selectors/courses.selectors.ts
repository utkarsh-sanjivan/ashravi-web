import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { initialState } from '@/store/courses.slice';

const selectCoursesDomain = (state: RootState) => state.courses ?? initialState;

export const selectCourseFilters = createSelector(
  selectCoursesDomain,
  (courses) => courses.filters
);

export const selectCourseCurrentPage = createSelector(
  selectCoursesDomain,
  (courses) => courses.currentPage
);

export const selectCoursesStatus = createSelector(
  selectCoursesDomain,
  (courses) => courses.status
);

export const selectCoursesError = createSelector(
  selectCoursesDomain,
  (courses) => courses.error
);
