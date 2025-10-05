import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.slice';
import courseCatalogReducer from './courseCatalog.slice';
import wishlistReducer from './wishlist.slice';
import childrenReducer from './children.slice';
import assessmentReducer from './assessment.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      courseCatalog: courseCatalogReducer,
      wishlist: wishlistReducer,
      children: childrenReducer,
      assessment: assessmentReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
