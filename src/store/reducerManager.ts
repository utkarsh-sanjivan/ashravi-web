import { combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, Reducer, ReducersMapObject } from '@reduxjs/toolkit';

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject;
  reduce: Reducer;
  add: (key: string, reducer: Reducer) => void;
  remove: (key: string) => void;
  has: (key: string) => boolean;
}

export const createReducerManager = (initialReducers: ReducersMapObject): ReducerManager => {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove: string[] = [];

  return {
    getReducerMap: () => reducers,
    reduce: (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
      if (keysToRemove.length > 0 && state) {
        state = { ...state } as typeof state;
        for (const key of keysToRemove) {
          delete (state as Record<string, unknown>)[key];
        }
        keysToRemove = [];
      }

      return combinedReducer(state, action);
    },
    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return;
      }

      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },
    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }

      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },
    has: (key: string) => Boolean(reducers[key]),
  };
};
