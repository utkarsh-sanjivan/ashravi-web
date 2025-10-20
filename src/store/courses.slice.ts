import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { fetchCoursesFromAPI } from '@/lib/api';

import type { Course } from '@/types';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: {
    category?: string;
    level?: string[];
    search?: string;
  };
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  filters: {},
};

// Async Thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
  }) => {
    // Convert comma-separated level string to array
    const levelArray = params.level ? params.level.split(',') : undefined;
    
    return await fetchCoursesFromAPI({
      page: params.page,
      limit: params.limit,
      category: params.category,
      level: levelArray,
      search: params.search,
    });
  }
);

export const searchCourses = createAsyncThunk(
  'courses/searchCourses',
  async (searchQuery: string) => {
    return await fetchCoursesFromAPI({
      search: searchQuery,
      page: 1,
      limit: 20,
    });
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        category?: string;
        level?: string[];
        search?: string;
      }>
    ) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Courses
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload.data;
      state.currentPage = action.payload.pagination.currentPage;
      state.totalPages = action.payload.pagination.totalPages;
      state.totalItems = action.payload.pagination.totalItems;
    });
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch courses';
    });

    // Search Courses
    builder.addCase(searchCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload.data;
      state.currentPage = action.payload.pagination.currentPage;
      state.totalPages = action.payload.pagination.totalPages;
      state.totalItems = action.payload.pagination.totalItems;
    });
    builder.addCase(searchCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to search courses';
    });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = courseSlice.actions;
export default courseSlice.reducer;
