import { createSlice } from '@reduxjs/toolkit';
import { loadRatings } from './storage';

// State shape: { [movieId]: 1 | 2 | 3 | 4 | 5 }
const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: loadRatings(),
  reducers: {
    rateMovie(state, action) {
      const { movieId, rating } = action.payload;
      state[movieId] = rating;
    },
    clearRating(state, action) {
      delete state[action.payload];
    },
  },
});

export const { rateMovie, clearRating } = ratingsSlice.actions;
export default ratingsSlice.reducer;
