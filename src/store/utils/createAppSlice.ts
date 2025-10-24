import { createSlice, type CreateSliceOptions, type SliceCaseReducers } from '@reduxjs/toolkit';

/**
 * Wraps RTK's {@link createSlice} to ensure a consistent action type prefix across the app.
 * The helper automatically prepends `app/` to every slice name so dispatched actions
 * remain traceable in Redux DevTools regardless of the feature module that emits them.
 */
export function createAppSlice<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(
  options: CreateSliceOptions<State, CaseReducers, Name>
) {
  const normalizedName = options.name.startsWith('app/') ? options.name : (`app/${options.name}` as Name);

  return createSlice({
    ...options,
    name: normalizedName,
  });
}
