export interface StorageEngine {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): StorageEngine => ({
  async getItem() {
    return null;
  },
  async setItem() {
    return undefined;
  },
  async removeItem() {
    return undefined;
  },
});

const createBrowserStorage = (): StorageEngine => ({
  async getItem(key: string) {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  },
});

export const persistStorage: StorageEngine =
  typeof window === 'undefined' ? createNoopStorage() : createBrowserStorage();
