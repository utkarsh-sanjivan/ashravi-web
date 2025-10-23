'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppPreloadedState, type AppStore } from '@/store';

export interface ProvidersProps {
  children: ReactNode;
  preloadedState?: AppPreloadedState;
}

export default function Providers({ children, preloadedState }: ProvidersProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
