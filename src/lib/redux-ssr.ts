import { headers } from 'next/headers';

import { makeStore, type AppPreloadedState, type AppStore } from '@/store';
import { apiService } from '@/services/api.service';
import type { RootState } from '@/store';

const HYDRATION_HEADER = 'x-redux-preload';
const REQUEST_ID_HEADER = 'x-request-id';
const HYDRATABLE_SLICE_KEYS = ['apiService', 'courses', 'wishlist', 'user'] as const;

type HydratableKey = (typeof HYDRATABLE_SLICE_KEYS)[number];
type PreloadedKey = Extract<keyof AppPreloadedState, string>;

type HydrationRegistry = Map<string, AppPreloadedState>;

const globalScope = globalThis as typeof globalThis & {
  __REDUX_HYDRATION_REGISTRY__?: HydrationRegistry;
};

const registry: HydrationRegistry =
  globalScope.__REDUX_HYDRATION_REGISTRY__ ?? new Map<string, AppPreloadedState>();

if (!globalScope.__REDUX_HYDRATION_REGISTRY__) {
  globalScope.__REDUX_HYDRATION_REGISTRY__ = registry;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const decodeState = (encoded: string): AppPreloadedState | undefined => {
  try {
    return JSON.parse(decodeURIComponent(encoded)) as AppPreloadedState;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[redux-ssr] Failed to decode preloaded state from header', error);
    }
    return undefined;
  }
};

const mergeStates = (
  base?: AppPreloadedState,
  next?: AppPreloadedState
): AppPreloadedState | undefined => {
  if (!base && !next) {
    return undefined;
  }

  if (!base) {
    return next;
  }

  if (!next) {
    return base;
  }

  return { ...base, ...next } satisfies AppPreloadedState;
};

const selectHydratableSlices = (
  state: RootState,
  allowlist: readonly HydratableKey[] = HYDRATABLE_SLICE_KEYS
): AppPreloadedState => {
  const partial: AppPreloadedState = {};

  for (const key of allowlist) {
    if (key in state) {
      Object.assign(partial, {
        [key]: state[key as keyof RootState],
      });
    }
  }

  return partial;
};

const getRequestIdentifier = async (): Promise<string | undefined> => {
  const headerList = await headers();
  return headerList.get(REQUEST_ID_HEADER) ?? headerList.get('x-middleware-request-id') ?? undefined;
};

export const getMiddlewarePreloadedState = async (): Promise<AppPreloadedState | undefined> => {
  const headerList = await headers();
  const encoded = headerList.get(HYDRATION_HEADER);
  return encoded ? decodeState(encoded) : undefined;
};

export const initializeServerStore = (
  preloadedState?: AppPreloadedState
): AppStore => makeStore(preloadedState);

export const awaitServerQueries = async (store: AppStore): Promise<void> => {
  try {
    const resolveQueries = apiService.util.getRunningQueriesThunk();
    await resolveQueries(store.dispatch, store.getState, undefined);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[redux-ssr] Failed to resolve running queries before hydration', error);
    }
  }
};

export const stageServerPreloadedState = async (
  store: AppStore,
  allowlist: readonly HydratableKey[] = HYDRATABLE_SLICE_KEYS
): Promise<void> => {
  const requestId = await getRequestIdentifier();
  if (!requestId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[redux-ssr] Missing request identifier — unable to stage hydration payload');
    }
    return;
  }

  const nextState = selectHydratableSlices(store.getState(), allowlist);
  const existing = registry.get(requestId);
  registry.set(requestId, mergeStates(existing, nextState) ?? nextState);
};

export const consumeServerPreloadedState = async (): Promise<AppPreloadedState | undefined> => {
  const requestId = await getRequestIdentifier();
  if (!requestId) {
    return undefined;
  }

  const state = registry.get(requestId);
  if (state) {
    registry.delete(requestId);
  }
  return state;
};

export const mergeHydrationStates = (
  base?: AppPreloadedState,
  next?: AppPreloadedState
): AppPreloadedState | undefined => mergeStates(base, next);

export const serializeHydratableState = (state: AppPreloadedState | undefined): AppPreloadedState | undefined => {
  if (!state) {
    return undefined;
  }

  const source = state as Record<string, unknown>;
  const serialized: Record<string, unknown> = {};

  for (const key of Object.keys(source)) {
    const value = source[key];
    serialized[key] = isObject(value) ? JSON.parse(JSON.stringify(value)) : value;
  }

  return serialized as AppPreloadedState;
};
