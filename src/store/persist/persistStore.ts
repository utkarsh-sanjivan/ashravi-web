import type { AnyAction } from '@reduxjs/toolkit';

import { PERSIST_BOOTSTRAP, PERSIST_REHYDRATE } from './constants';
import { getPersistConfigs, subscribeToPersistRegistry } from './registry';

export interface PersistorState {
  bootstrapped: boolean;
}

export interface Persistor {
  persist: () => void;
  subscribe: (listener: () => void) => () => void;
  getState: () => PersistorState;
  purge: () => Promise<void>;
  flush: () => Promise<void>;
  destroy: () => void;
}

const hydrateConfig = async (
  store: { dispatch: (action: AnyAction) => void },
  config: ReturnType<typeof getPersistConfigs>[number]
) => {
  try {
    const stored = await config.storage.getItem(config.storageKey);
    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored) as { version: number; state: unknown } | null;
    if (!parsed || typeof parsed !== 'object') {
      return;
    }

    store.dispatch({
      type: PERSIST_REHYDRATE,
      payload: { key: config.key, state: parsed.state },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[persist] Failed to rehydrate state', error);
    }
  }
};

export const persistStore = (store: { dispatch: (action: AnyAction) => void }): Persistor => {
  let bootstrapped = false;
  const listeners = new Set<() => void>();
  let destroyed = false;

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const bootstrap = async () => {
    if (bootstrapped || destroyed) {
      return;
    }

    const configs = getPersistConfigs();
    await Promise.all(configs.map((config) => hydrateConfig(store, config)));
    store.dispatch({ type: PERSIST_BOOTSTRAP });
    bootstrapped = true;
    notify();
  };

  const unsubscribeRegistry = subscribeToPersistRegistry((config) => {
    if (destroyed) {
      return;
    }

    void hydrateConfig(store, config).then(() => {
      store.dispatch({ type: PERSIST_BOOTSTRAP });
      notify();
    });
  });

  if (typeof window !== 'undefined') {
    void bootstrap();
  }

  return {
    persist: () => {
      void bootstrap();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState: () => ({ bootstrapped }),
    purge: async () => {
      const configs = getPersistConfigs();
      await Promise.all(configs.map((config) => config.storage.removeItem(config.storageKey)));
    },
    flush: async () => {
      // Writes are flushed on idle; return resolved promise for API parity.
      return Promise.resolve();
    },
    destroy: () => {
      destroyed = true;
      listeners.clear();
      unsubscribeRegistry();
    },
  };
};
