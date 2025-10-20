import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

interface ChildrenState {
  children: Child[];
}

const initialState: ChildrenState = {
  children: [],
};

const childrenSlice = createSlice({
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
