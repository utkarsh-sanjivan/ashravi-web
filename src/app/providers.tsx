'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppPreloadedState, type AppStore } from '@/store';
import { PersistGate, persistStore, type Persistor } from '@/store/persist';
import { ensureFeatureModules } from '@/store/modules/registry';
import type { FeatureModuleKey } from '@/store/modules/registry';

const BASE_FEATURES: FeatureModuleKey[] = [];
const STARTUP_FEATURES: FeatureModuleKey[] =
  process.env.NODE_ENV !== 'production' ? ['mock'] : BASE_FEATURES;

export interface ProvidersProps {
  children: ReactNode;
  preloadedState?: AppPreloadedState;
}

export default function Providers({ children, preloadedState }: ProvidersProps) {
  const storeRef = useRef<AppStore>();
  const persistorRef = useRef<Persistor>();
  const [persistor, setPersistor] = useState<Persistor | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState);
  }

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const store = storeRef.current;
      if (!store) {
        return;
      }

      try {
        await ensureFeatureModules(store, STARTUP_FEATURES);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Providers] Failed to preload feature modules', error);
        }
      }

      if (typeof window === 'undefined' || cancelled || persistorRef.current) {
        return;
      }

      const instance = persistStore(store);
      persistorRef.current = instance;
      if (!cancelled) {
        setPersistor(instance);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
      persistorRef.current?.destroy();
      persistorRef.current = undefined;
    };
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
}
