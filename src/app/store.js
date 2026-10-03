import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '../api/tmdbApi';
import ratingsReducer from '../features/ratings/ratingsSlice';
import filtersReducer from '../features/filters/filtersSlice';
import { saveRatings } from '../features/ratings/storage';

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer, // server state (RTK Query cache)
    ratings: ratingsReducer, // client state: the user's star ratings
    filters: filtersReducer, // client state: search / filter / page
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});

// Persistence: whenever the ratings object changes, write it to localStorage.
// Immer gives us a NEW object only when a rating really changed, so the
// reference check below avoids pointless writes.
let previousRatings = store.getState().ratings;
store.subscribe(() => {
  const currentRatings = store.getState().ratings;
  if (currentRatings !== previousRatings) {
    previousRatings = currentRatings;
    saveRatings(currentRatings);
  }
});
