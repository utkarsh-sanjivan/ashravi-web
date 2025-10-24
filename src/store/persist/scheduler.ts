import type { StorageEngine } from './storage';

interface PersistQueueItem {
  storage: StorageEngine;
  storageKey: string;
  version: number;
  state: unknown;
}

const queue = new Map<string, PersistQueueItem>();
let flushing = false;

const writeState = async (item: PersistQueueItem) => {
  const payload = JSON.stringify({ version: item.version, state: item.state });

  try {
    await item.storage.setItem(item.storageKey, payload);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[persist] Failed to write state', error);
    }
  }
};

const flushQueue = async () => {
  if (flushing) {
    return;
  }

  flushing = true;

  try {
    const items = Array.from(queue.values());
    queue.clear();

    for (const item of items) {
      await writeState(item);
    }
  } finally {
    flushing = false;
  }
};

export const schedulePersist = (
  storageKey: string,
  storage: StorageEngine,
  state: unknown,
  version: number
) => {
  queue.set(storageKey, { storageKey, storage, state, version });

  if (typeof window === 'undefined') {
    return;
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      void flushQueue();
    });
    return;
  }

  void Promise.resolve().then(() => flushQueue());
};
