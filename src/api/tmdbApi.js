import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const rawBaseQuery = fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' });

// Wraps fetchBaseQuery so every request automatically gets the API key and
// language. If the key is missing we fail fast with a readable error.
const baseQuery = async (args, api, extraOptions) => {
  if (!API_KEY) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error:
          'No TMDB API key found. Copy .env.example to .env, add VITE_TMDB_API_KEY, then restart the dev server.',
      },
    };
  }
  const request = typeof args === 'string' ? { url: args } : args;
  return rawBaseQuery(
    {
      ...request,
      params: { ...request.params, api_key: API_KEY, language: 'en-US' },
    },
    api,
    extraOptions,
  );
};

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery,
  endpoints: (builder) => ({
    // GET /genre/movie/list  (id -> name lookup + filter dropdown)
    getGenres: builder.query({
      query: () => '/genre/movie/list',
      transformResponse: (response) => response.genres,
      keepUnusedDataFor: 60 * 60 * 24, // genres almost never change
    }),

    // Movie list. Two TMDB endpoints depending on whether the user is searching:
    //  - no search text -> /discover/movie (supports genre, year and rating filters)
    //  - search text    -> /search/movie   (supports year only, so genre and
    //                      rating are applied to the returned page in transformResponse)
    getMovies: builder.query({
      query: ({ query, page, genreId, year, minVoteAverage }) => {
        if (query) {
          return {
            url: '/search/movie',
            params: {
              query,
              page,
              include_adult: false,
              ...(year && { primary_release_year: year }),
            },
          };
        }
        return {
          url: '/discover/movie',
          params: {
            page,
            sort_by: 'popularity.desc',
            include_adult: false,
            ...(genreId && { with_genres: genreId }),
            ...(year && { primary_release_year: year }),
            // vote_count.gte stops movies with a single 10/10 vote from topping the list
            ...(minVoteAverage && {
              'vote_average.gte': minVoteAverage,
              'vote_count.gte': 100,
            }),
          },
        };
      },
      transformResponse: (response, meta, arg) => {
        let results = response.results;
        if (arg.query) {
          if (arg.genreId) {
            results = results.filter((m) => m.genre_ids?.includes(Number(arg.genreId)));
          }
          if (arg.minVoteAverage) {
            results = results.filter((m) => m.vote_average >= arg.minVoteAverage);
          }
        }
        return {
          results,
          page: response.page,
          // TMDB only serves the first 500 pages
          totalPages: Math.min(response.total_pages, 500),
          totalResults: response.total_results,
        };
      },
    }),

    // GET /movie/{id}?append_to_response=credits
    // ONE request returns the details AND the cast/crew.
    getMovieDetails: builder.query({
      query: (movieId) => ({
        url: `/movie/${movieId}`,
        params: { append_to_response: 'credits' },
      }),
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieDetailsQuery,
} = tmdbApi;
