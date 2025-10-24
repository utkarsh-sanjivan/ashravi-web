import type { AnyAction, EnhancedStore } from '@reduxjs/toolkit';

import type { ReducerManager } from './reducerManager';

export type AppStoreWithManager = EnhancedStore<any, AnyAction> & {
  reducerManager: ReducerManager;
};
