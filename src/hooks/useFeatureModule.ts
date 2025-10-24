'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/store/hooks';
import { ensureFeatureModule, ensureFeatureModules } from '@/store/modules/registry';
import type { FeatureModuleKey } from '@/store/modules/registry';

export const useFeatureModule = (feature: FeatureModuleKey): boolean => {
  const store = useAppStore();
  const [ready, setReady] = useState(() => store.reducerManager.has(feature));

  useEffect(() => {
    let cancelled = false;

    if (ready) {
      return;
    }

    ensureFeatureModule(store, feature).then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [feature, ready, store]);

  return ready;
};

export const useFeatureModules = (features: FeatureModuleKey[]): boolean => {
  const store = useAppStore();
  const [ready, setReady] = useState(() => features.every((feature) => store.reducerManager.has(feature)));

  const stableFeatures = useMemo(() => Array.from(new Set(features)), [features]);

  useEffect(() => {
    let cancelled = false;

    ensureFeatureModules(store, stableFeatures).then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [stableFeatures, store]);

  return ready;
};
