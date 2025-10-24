import assessmentReducer from '../assessment.slice';
import type { AppStoreWithManager } from '../types';

export const ASSESSMENT_MODULE_KEY = 'assessment';

export const createAssessmentReducer = () => assessmentReducer;

export const registerAssessmentModule = (store: AppStoreWithManager) => {
  if (!store.reducerManager.has(ASSESSMENT_MODULE_KEY)) {
    store.reducerManager.add(ASSESSMENT_MODULE_KEY, createAssessmentReducer());
  }

  store.dispatch({ type: `@@modules/INIT_${ASSESSMENT_MODULE_KEY.toUpperCase()}` });
};
