import type { StorageEngine } from './storage';

export interface InternalPersistConfig<S = any> {
  key: string;
  storageKey: string;
  storage: StorageEngine;
  version: number;
  whitelist?: Array<keyof S>;
  blacklist?: Array<keyof S>;
}

export type PersistRegistryListener = (config: InternalPersistConfig) => void;

const registry = new Map<string, InternalPersistConfig>();
const listeners = new Set<PersistRegistryListener>();

export const registerPersistConfig = <S>(config: InternalPersistConfig<S>): InternalPersistConfig<S> => {
  const existing = registry.get(config.key);

  if (existing) {
    return existing as InternalPersistConfig<S>;
  }

  registry.set(config.key, config as InternalPersistConfig);
  listeners.forEach((listener) => listener(config as InternalPersistConfig));
  return config;
};

export const getPersistConfigs = (): InternalPersistConfig[] => Array.from(registry.values());

export const subscribeToPersistRegistry = (listener: PersistRegistryListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
