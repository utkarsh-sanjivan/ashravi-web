import type { PersistReducerConfig } from './persistReducer';
import { persistStorage } from './storage';

export const createSlicePersistConfig = <S>(
  key: string,
  options: Pick<PersistReducerConfig<S>, 'whitelist' | 'blacklist'> = {}
): PersistReducerConfig<S> => ({
  key,
  storage: persistStorage,
  version: 1,
  whitelist: options.whitelist,
  blacklist: options.blacklist,
  storageKey: `ashravi:${key}`,
});
