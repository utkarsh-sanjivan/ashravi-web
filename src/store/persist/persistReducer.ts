import type { AnyAction, Reducer } from '@reduxjs/toolkit';

import { PERSIST_BOOTSTRAP, PERSIST_REHYDRATE } from './constants';
import { schedulePersist } from './scheduler';
import type { InternalPersistConfig } from './registry';
import { registerPersistConfig } from './registry';
import type { StorageEngine } from './storage';

const createFilteredState = <S>(
  state: S,
  whitelist?: Array<keyof S>,
  blacklist?: Array<keyof S>
): Partial<S> => {
  if (whitelist && whitelist.length > 0) {
    return whitelist.reduce<Partial<S>>((acc, key) => {
      acc[key] = state[key];
      return acc;
    }, {});
  }

  if (blacklist && blacklist.length > 0) {
    const filtered: Partial<S> = { ...state };
    blacklist.forEach((key) => {
      delete filtered[key];
    });
    return filtered;
  }

  return { ...(state as Partial<S>) };
};

export interface PersistReducerConfig<S> {
  key: string;
  storage: StorageEngine;
  version?: number;
  whitelist?: Array<keyof S>;
  blacklist?: Array<keyof S>;
  storageKey?: string;
}

export const persistReducer = <S, A extends AnyAction = AnyAction>(
  config: PersistReducerConfig<S>,
  baseReducer: Reducer<S, A>
): Reducer<S, A> => {
  const storageKey = config.storageKey ?? `persist:${config.key}`;
  const registeredConfig = registerPersistConfig({
    key: config.key,
    storageKey,
    storage: config.storage,
    version: config.version ?? 1,
    whitelist: config.whitelist,
    blacklist: config.blacklist,
  });

  let rehydrated = false;
  let pendingState: S | undefined;

  const persistState = (state: S) => {
    const filtered = createFilteredState(state, registeredConfig.whitelist, registeredConfig.blacklist);
    schedulePersist(registeredConfig.storageKey, registeredConfig.storage, filtered, registeredConfig.version);
  };

  return (state: S | undefined, action: A) => {
    const baseState = state ?? baseReducer(undefined, { type: '@@INIT' } as A);

    if ((action as AnyAction).type === PERSIST_REHYDRATE) {
      const payload = (action as AnyAction).payload as { key?: string; state?: Partial<S> } | undefined;
      if (payload?.key === config.key) {
        const incomingState = payload.state ?? {};
        const mergedState = baseReducer(
          { ...baseState, ...incomingState } as S,
          { type: '@@persist/SET_STATE' } as A
        );
        rehydrated = true;
        pendingState = undefined;
        persistState(mergedState);
        return mergedState;
      }
    }

    if ((action as AnyAction).type === PERSIST_BOOTSTRAP) {
      if (!rehydrated) {
        rehydrated = true;
        if (pendingState) {
          persistState(pendingState);
          pendingState = undefined;
        }
      }
      return baseState;
    }

    const nextState = baseReducer(baseState, action);
    const stateChanged = nextState !== baseState;

    if (!rehydrated) {
      if (stateChanged) {
        pendingState = nextState;
      }
    } else if ((action as AnyAction).type !== PERSIST_REHYDRATE && stateChanged) {
      persistState(nextState);
    }

    return nextState;
  };
};
