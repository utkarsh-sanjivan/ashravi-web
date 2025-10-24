import type { AppStoreWithManager } from '../types';
import { ASSESSMENT_MODULE_KEY } from './assessment.module';
import { CHILDREN_MODULE_KEY } from './children.module';
import { COURSES_MODULE_KEY } from './courses.module';
import { MOCK_MODULE_KEY } from './mock.module';
import { USER_MODULE_KEY } from './user.module';
import { WISHLIST_MODULE_KEY } from './wishlist.module';

export type FeatureModuleKey =
  | typeof ASSESSMENT_MODULE_KEY
  | typeof CHILDREN_MODULE_KEY
  | typeof COURSES_MODULE_KEY
  | typeof MOCK_MODULE_KEY
  | typeof USER_MODULE_KEY
  | typeof WISHLIST_MODULE_KEY;

type ModuleLoader = (store: AppStoreWithManager) => Promise<void>;

const loaders: Record<FeatureModuleKey, ModuleLoader> = {
  [ASSESSMENT_MODULE_KEY]: async (store) => {
    const { registerAssessmentModule } = await import('./assessment.module');
    registerAssessmentModule(store);
  },
  [CHILDREN_MODULE_KEY]: async (store) => {
    const { registerChildrenModule } = await import('./children.module');
    registerChildrenModule(store);
  },
  [COURSES_MODULE_KEY]: async (store) => {
    const { registerCoursesModule } = await import('./courses.module');
    registerCoursesModule(store);
  },
  [MOCK_MODULE_KEY]: async (store) => {
    const { registerMockModule } = await import('./mock.module');
    registerMockModule(store);
  },
  [USER_MODULE_KEY]: async (store) => {
    const { registerUserModule } = await import('./user.module');
    registerUserModule(store);
  },
  [WISHLIST_MODULE_KEY]: async (store) => {
    const { registerWishlistModule } = await import('./wishlist.module');
    registerWishlistModule(store);
  },
};

export const ensureFeatureModule = async (store: AppStoreWithManager, feature: FeatureModuleKey) => {
  if (store.reducerManager.has(feature)) {
    return;
  }

  const loader = loaders[feature];
  if (!loader) {
    throw new Error(`Unknown feature module: ${feature}`);
  }

  await loader(store);
};

export const ensureFeatureModules = async (
  store: AppStoreWithManager,
  features: FeatureModuleKey[]
) => {
  for (const feature of features) {
    // eslint-disable-next-line no-await-in-loop
    await ensureFeatureModule(store, feature);
  }
};
