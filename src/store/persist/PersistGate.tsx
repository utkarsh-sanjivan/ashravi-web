'use client';

import { useEffect, useState } from 'react';

import type { Persistor } from './persistStore';

export interface PersistGateProps {
  persistor?: Persistor;
  children: React.ReactNode;
  loading?: React.ReactNode;
}

export function PersistGate({ persistor, children, loading = null }: PersistGateProps) {
  const [bootstrapped, setBootstrapped] = useState(() => persistor?.getState().bootstrapped ?? true);

  useEffect(() => {
    if (!persistor) {
      return;
    }

    const unsubscribe = persistor.subscribe(() => {
      const state = persistor.getState();
      if (state.bootstrapped) {
        setBootstrapped(true);
      }
    });

    if (!persistor.getState().bootstrapped) {
      persistor.persist();
    }

    return () => {
      unsubscribe();
    };
  }, [persistor]);

  if (!persistor) {
    return <>{children}</>;
  }

  if (!bootstrapped) {
    return <>{loading}</>;
  }

  return <>{children}</>;
}
