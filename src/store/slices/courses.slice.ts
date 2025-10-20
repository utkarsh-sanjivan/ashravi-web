import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import courseService from '@/services/courseService';
import type { Course } from '@/types';

interface CourseState {
  courses: Course[];
  featuredCourses: Course[];
  popularCourses: Course[];
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
  featuredCourses: [],
  popularCourses: [],
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
    minPrice?: number;
    maxPrice?: number;
    levels?: string[];
    minRating?: number;
    sortBy?: string;
  }) => {
    // Convert comma-separated level string to array if needed
    const levelArray = params.level ? params.level.split(',') : params.levels;

    return await courseService.getCourses({
      page: params.page,
      limit: params.limit,
      category: params.category,
      level: levelArray,
      search: params.search,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.minRating,
      sortBy: params.sortBy,
    });
  }
);

export const searchCourses = createAsyncThunk(
  'courses/searchCourses',
  async (searchQuery: string) => {
    return await courseService.searchCourses(searchQuery);
  }
);

export const fetchFeaturedCourses = createAsyncThunk(
  'courses/fetchFeaturedCourses',
  async (limit: number = 10) => {
    return await courseService.getFeaturedCourses(limit);
  }
);

export const fetchPopularCourses = createAsyncThunk(
  'courses/fetchPopularCourses',
  async (limit: number = 10) => {
    return await courseService.getPopularCourses(limit);
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

    // Fetch Featured Courses
    builder.addCase(fetchFeaturedCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.featuredCourses = action.payload;
    });
    builder.addCase(fetchFeaturedCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch featured courses';
    });

    // Fetch Popular Courses
    builder.addCase(fetchPopularCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPopularCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.popularCourses = action.payload;
    });
    builder.addCase(fetchPopularCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch popular courses';
    });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = courseSlice.actions;
export default courseSlice.reducer;
