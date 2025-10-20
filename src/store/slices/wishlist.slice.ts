import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  courseIds: string[];
}

const initialState: WishlistState = {
  courseIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.courseIds.includes(action.payload)) {
        state.courseIds.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.courseIds = state.courseIds.filter((id) => id !== action.payload);
    },
    clearWishlist: (state) => {
      state.courseIds = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
