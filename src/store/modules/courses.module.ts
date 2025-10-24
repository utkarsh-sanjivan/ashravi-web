import coursesReducer, { type CourseState } from '../courses.slice';
import type { AppStoreWithManager } from '../types';
import { createSlicePersistConfig, persistReducer } from '../persist';

export const COURSES_MODULE_KEY = 'courses';

export const createCoursesReducer = () =>
  persistReducer<CourseState>(
    createSlicePersistConfig<CourseState>(COURSES_MODULE_KEY, {
      whitelist: ['filters', 'currentPage'],
    }),
    coursesReducer
  );

export const registerCoursesModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(COURSES_MODULE_KEY)) {
    store.reducerManager.add(COURSES_MODULE_KEY, createCoursesReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${COURSES_MODULE_KEY.toUpperCase()}` });
};
