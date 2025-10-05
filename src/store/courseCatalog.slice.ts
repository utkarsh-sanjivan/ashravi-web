import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  category: string;
  price: number;
}

interface CourseCatalogState {
  courses: Course[];
  loading: boolean;
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
  };
}

const initialState: CourseCatalogState = {
  courses: [],
  loading: false,
  filters: {
    category: null,
    priceRange: null,
  },
};

const courseCatalogSlice = createSlice({
  name: 'courseCatalog',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilters: (state, action: PayloadAction<CourseCatalogState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const { setCourses, setLoading, setFilters } = courseCatalogSlice.actions;
export default courseCatalogSlice.reducer;
