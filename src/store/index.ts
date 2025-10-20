import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import coursesReducer from './slices/courses.slice';
import wishlistReducer from './slices/wishlist.slice';
import childrenReducer from './slices/children.slice';
import assessmentReducer from './slices/assessment.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,          // ✅ RENAMED from 'user' to 'auth'
    courses: coursesReducer,
    wishlist: wishlistReducer,
    children: childrenReducer,
    assessment: assessmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
