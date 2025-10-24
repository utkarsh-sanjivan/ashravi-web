import childrenReducer from '../children.slice';
import type { AppStoreWithManager } from '../types';

export const CHILDREN_MODULE_KEY = 'children';

export const createChildrenReducer = () => childrenReducer;

export const registerChildrenModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(CHILDREN_MODULE_KEY)) {
    store.reducerManager.add(CHILDREN_MODULE_KEY, createChildrenReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${CHILDREN_MODULE_KEY.toUpperCase()}` });
};
