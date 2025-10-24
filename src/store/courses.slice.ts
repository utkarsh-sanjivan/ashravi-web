import { PayloadAction } from '@reduxjs/toolkit';

import { coursesApi } from '@/store/api/courses.api';
import { createAppSlice } from '@/store/utils/createAppSlice';
import { resolveRejectedActionError } from '@/store/utils/error';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CourseFiltersState {
  category?: string;
  level?: string[];
  search?: string;
}

export interface CourseState {
  currentPage: number;
  filters: CourseFiltersState;
  status: LoadingStatus;
  error: string | null;
}

export const initialState: CourseState = {
  currentPage: 1,
  filters: {},
  status: 'idle',
  error: null,
};

const courseSlice = createAppSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CourseFiltersState>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(coursesApi.endpoints.list.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(coursesApi.endpoints.list.matchFulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(coursesApi.endpoints.list.matchRejected, (state, action) => {
        state.status = 'failed';
        const resolved = resolveRejectedActionError(action, 'Unable to load courses');
        state.error = resolved.message;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = courseSlice.actions;
export default courseSlice.reducer;
