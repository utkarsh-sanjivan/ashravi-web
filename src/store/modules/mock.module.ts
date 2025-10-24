import mockReducer from '../mock.slice';
import type { AppStoreWithManager } from '../types';

export const MOCK_MODULE_KEY = 'mock';

export const createMockReducer = () => mockReducer;

export const registerMockModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(MOCK_MODULE_KEY)) {
    store.reducerManager.add(MOCK_MODULE_KEY, createMockReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${MOCK_MODULE_KEY.toUpperCase()}` });
};
