import { combineReducers, configureStore } from '@reduxjs/toolkit';

import assessmentReducer from './assessment.slice';
import childrenReducer from './children.slice';
import coursesReducer from './courses.slice';
import userReducer from './user.slice';
import wishlistReducer from './wishlist.slice';

const rootReducer = combineReducers({
  assessment: assessmentReducer,
  children: childrenReducer,
  courses: coursesReducer,
  user: userReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppPreloadedState = Partial<RootState>;

export const makeStore = (preloadedState?: AppPreloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

export const store = makeStore();
