import wishlistReducer, { type WishlistState } from '../wishlist.slice';
import type { AppStoreWithManager } from '../types';
import { createSlicePersistConfig, persistReducer } from '../persist';

export const WISHLIST_MODULE_KEY = 'wishlist';

export const createWishlistReducer = () =>
  persistReducer<WishlistState>(
    createSlicePersistConfig<WishlistState>(WISHLIST_MODULE_KEY, {
      whitelist: ['courseIds'],
    }),
    wishlistReducer
  );

export const registerWishlistModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(WISHLIST_MODULE_KEY)) {
    store.reducerManager.add(WISHLIST_MODULE_KEY, createWishlistReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${WISHLIST_MODULE_KEY.toUpperCase()}` });
};
