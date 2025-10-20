import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './courses.slice';
import userReducer from './user.slice';
import coursesReducer from './courses.slice';
import wishlistReducer from './wishlist.slice';
import childrenReducer from './children.slice';
import assessmentReducer from './assessment.slice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    children: childrenReducer,
    assessment: assessmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
