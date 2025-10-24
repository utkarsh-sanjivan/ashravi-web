import userReducer from '../user.slice';
import type { AppStoreWithManager } from '../types';

export const USER_MODULE_KEY = 'user';

export const createUserReducer = () => userReducer;

export const registerUserModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(USER_MODULE_KEY)) {
    store.reducerManager.add(USER_MODULE_KEY, createUserReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${USER_MODULE_KEY.toUpperCase()}` });
};
