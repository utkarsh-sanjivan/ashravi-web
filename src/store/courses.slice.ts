import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Import mock data as fallback
import coursesData from '@/mock-data/courses.json';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor?: string;
  rating?: number;
  studentCount?: number;
  duration: number;
  category: string;
  price: number;
  originalPrice?: number;
}

interface CoursesState {
  courses: Course[];
  featuredCourses: Course[];
  popularCourses: Course[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
  };
}

const initialState: CoursesState = {
  courses: [],
  featuredCourses: [],
  popularCourses: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: null,
  },
};

// Async thunk to fetch all courses
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get<Course[]>('/courses');
      // return response;
      
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return coursesData as Course[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

// Async thunk to fetch featured courses
export const fetchFeaturedCourses = createAsyncThunk(
  'courses/fetchFeaturedCourses',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get<Course[]>(`/courses/featured?limit=${limit}`);
      // return response;
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return coursesData.slice(0, limit) as Course[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured courses');
    }
  }
);

// Async thunk to fetch popular courses (sorted by student count)
export const fetchPopularCourses = createAsyncThunk(
  'courses/fetchPopularCourses',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get<Course[]>(`/courses/popular?limit=${limit}`);
      // return response;
      
      // Mock API call - sort by student count
      await new Promise(resolve => setTimeout(resolve, 500));
      const sortedCourses = [...coursesData]
        .sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0))
        .slice(0, limit);
      return sortedCourses as Course[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch popular courses');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch featured courses
    builder
      .addCase(fetchFeaturedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredCourses = action.payload;
      })
      .addCase(fetchFeaturedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch popular courses
    builder
      .addCase(fetchPopularCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.popularCourses = action.payload;
      })
      .addCase(fetchPopularCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = coursesSlice.actions;
export default coursesSlice.reducer;
