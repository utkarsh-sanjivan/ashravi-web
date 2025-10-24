import { PayloadAction } from '@reduxjs/toolkit';

import { createAppSlice } from '@/store/utils/createAppSlice';

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

export interface ChildrenState {
  children: Child[];
}

export const initialState: ChildrenState = {
  children: [],
};

const childrenSlice = createAppSlice({
  name: 'children',
  initialState,
  reducers: {
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload);
    },
    removeChild: (state, action: PayloadAction<string>) => {
      state.children = state.children.filter((child) => child.id !== action.payload);
    },
    updateChild: (state, action: PayloadAction<Child>) => {
      const index = state.children.findIndex((child) => child.id === action.payload.id);
      if (index !== -1) {
        state.children[index] = action.payload;
      }
    },
  },
});

export const { addChild, removeChild, updateChild } = childrenSlice.actions;
export default childrenSlice.reducer;
