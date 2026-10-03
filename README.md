# Movie Review

Browse, search, filter and rate movies. Built with React, Vite, Tailwind CSS,
Redux Toolkit, RTK Query, React Router and the TMDB API. No backend, no login.

## Run it

```bash
npm install
cp .env.example .env     # then paste your own TMDB v3 API key into .env
npm run dev
```

Get a key at https://www.themoviedb.org/settings/api.
`.env` is in `.gitignore`; only `.env.example` is committed.
Vite exposes only variables starting with `VITE_`, and any such variable ends up
in the browser bundle. That is fine for a class project, but a production app
would hide the key behind a small server.

## Architecture

| Kind of state | Where it lives | Why |
| --- | --- | --- |
| Movies, search results, details, cast, genres, loading, errors | **RTK Query** (`src/api/tmdbApi.js`) | It is server data. RTK Query fetches, caches, de-duplicates and tracks loading/error for us. |
| User ratings `{ [movieId]: 1-5 }` | **Redux slice** (`features/ratings`) + localStorage | Read in many places (card, details page) and must survive refresh. |
| Search text, genre, year, rating, page | **Redux slice** (`features/filters`) | Filters must still be there when the user opens a movie and presses Back. |
| What the user is currently typing, hover preview on stars | `useState` inside the component | Only that one component cares. |

**Why no Axios?** RTK Query already sends the requests (`fetchBaseQuery` wraps
`fetch`). Axios would be a second HTTP layer that does nothing extra here.

**Why no Context API or useReducer?** Redux already covers shared state, and
the filters are simple enough for a slice. Adding Context or useReducer on top
would be a second way to do the same job.

### Persistence
`app/store.js` subscribes to the store. When `state.ratings` changes it calls
`saveRatings()` (`features/ratings/storage.js`), which writes JSON to
localStorage. On startup the slice's `initialState` is `loadRatings()`.
Corrupted or blocked storage falls back to "no ratings".

### TMDB endpoints
| Purpose | Endpoint |
| --- | --- |
| Browse + filter (no search text) | `GET /discover/movie` with `with_genres`, `primary_release_year`, `vote_average.gte` |
| Search by title | `GET /search/movie` with `query`, `primary_release_year` |
| Details **and** cast in one request | `GET /movie/{id}?append_to_response=credits` |
| Genre names | `GET /genre/movie/list` (cached for 24h) |

**Known limitation:** `/search/movie` cannot filter by genre or rating. While
searching, those two filters are applied to the current page of results, and the
UI says so. Year works in both modes.

**Rating scale:** TMDB scores are 0-10. The UI shows them as 0-5 stars
(score / 2). The rating filter options are 3, 3.5 and 4 stars & up.
The discover filter also requires 100+ votes so a film with one 10/10 vote
doesn't top the list.

### Folder structure
```
src/
  api/tmdbApi.js            RTK Query endpoints
  app/store.js              store + localStorage subscription
  features/ratings/         ratingsSlice.js, storage.js
  features/filters/         filtersSlice.js
  components/               SearchBar, FilterBar, MovieGrid, MovieCard,
                            StarRating, UserRating, Pagination, StateMessage, Layout
  pages/                    HomePage, MovieDetailsPage, NotFoundPage
  hooks/useDebounce.js
  utils/tmdb.js             image URLs, date/runtime formatting, error messages
```

## Course concepts, mapped

| Concept | Where |
| --- | --- |
| Vite project setup | `vite.config.js`, `index.html` |
| Components and props | `MovieCard`, `MovieGrid`, `StarRating` |
| Callback props | `SearchBar onSearch`, `FilterBar onGenreChange…`, `StarRating onChange` |
| Prop drilling (kept shallow on purpose) | `HomePage → MovieGrid → MovieCard` passes `genresById` |
| useState, lists and keys | `StarRating` hover state, `MovieGrid` (`key={movie.id}`) |
| Controlled inputs | `SearchBar` text input, `FilterBar` selects |
| useEffect | `useDebounce` (with cleanup), `Layout` scroll reset, `SearchBar` |
| React Router, route params | `App.jsx`, `/movie/:movieId` via `useParams` |
| Redux Toolkit | `ratingsSlice`, `filtersSlice`, `configureStore` |
| RTK Query | `tmdbApi.js` (`createApi`, `transformResponse`, auto-generated hooks) |

## Edge cases handled
Loading spinner, error messages (missing key, bad key, offline, rate limit,
404), empty results, missing poster, missing description, missing cast,
missing release date, movies with no public votes.

## Attribution
This product uses the TMDB API but is not endorsed or certified by TMDB.
