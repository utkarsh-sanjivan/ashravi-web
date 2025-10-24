import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { initialState } from '@/store/mock.slice';

const selectMockDomain = (state: RootState) => (state as RootState & { mock?: typeof initialState }).mock ?? initialState;

export const selectMockCourses = createSelector(selectMockDomain, (mock) => mock.courses);
