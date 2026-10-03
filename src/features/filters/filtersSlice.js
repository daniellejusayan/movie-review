import { createSlice } from '@reduxjs/toolkit';

// Lives in Redux (not local state) so the filters survive when the user opens
// a movie and comes back with the browser's Back button.
const initialState = {
  query: '',
  genreId: '',
  year: '',
  minVoteAverage: 0, // TMDB scores are 0-10; the UI shows them as 0-5 stars
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;
    },
    setGenre(state, action) {
      state.genreId = action.payload;
      state.page = 1;
    },
    setYear(state, action) {
      state.year = action.payload;
      state.page = 1;
    },
    setMinRating(state, action) {
      state.minVoteAverage = Number(action.payload);
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setQuery, setGenre, setYear, setMinRating, setPage, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
