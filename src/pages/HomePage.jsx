import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetGenresQuery, useGetMoviesQuery } from '../api/tmdbApi';
import {
  resetFilters,
  setGenre,
  setMinRating,
  setPage,
  setQuery,
  setYear,
} from '../features/filters/filtersSlice';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import StateMessage, { Spinner } from '../components/StateMessage';
import { describeError } from '../utils/tmdb';

export default function HomePage() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const { query, genreId, year, minVoteAverage, page } = filters;

  const { data: genres = [] } = useGetGenresQuery();
  const genresById = useMemo(
    () => Object.fromEntries(genres.map((genre) => [genre.id, genre.name])),
    [genres],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useGetMoviesQuery({
    query,
    page,
    genreId,
    year,
    minVoteAverage,
  });

  const hasActiveFilters = Boolean(query || genreId || year || minVoteAverage);
  // While searching, TMDB can't filter by genre/rating, so those only trim the current page.
  const filtersTrimPage = Boolean(query && (genreId || minVoteAverage));

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let content;
  if (isLoading) {
    content = <Spinner label="Loading movies…" />;
  } else if (isError) {
    const { title, message } = describeError(error);
    content = (
      <StateMessage title={title} message={message} actionLabel="Try again" onAction={refetch} />
    );
  } else if (data.results.length === 0) {
    content = (
      <StateMessage
        title="No movies found"
        message={
          filtersTrimPage && data.totalResults > 0
            ? 'Nothing on this page matches your genre and rating filters. Try the next page or loosen the filters.'
            : 'Try a different title or loosen the filters.'
        }
        actionLabel="Reset filters"
        onAction={() => dispatch(resetFilters())}
      />
    );
  } else {
    content = (
      <div aria-busy={isFetching} className={isFetching ? 'opacity-60 transition-opacity' : ''}>
        <MovieGrid movies={data.results} genresById={genresById} />
        <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <SearchBar value={query} onSearch={(text) => dispatch(setQuery(text))} />
        <FilterBar
          genres={genres}
          genreId={genreId}
          year={year}
          minVoteAverage={minVoteAverage}
          hasActiveFilters={hasActiveFilters}
          onGenreChange={(value) => dispatch(setGenre(value))}
          onYearChange={(value) => dispatch(setYear(value))}
          onRatingChange={(value) => dispatch(setMinRating(value))}
          onReset={() => dispatch(resetFilters())}
        />
      </section>

      <section>
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold">
            {query ? `Results for “${query}”` : hasActiveFilters ? 'Filtered movies' : 'Popular movies'}
          </h1>
          {data && !filtersTrimPage && (
            <p className="text-sm text-muted">{data.totalResults.toLocaleString()} movies</p>
          )}
          {filtersTrimPage && (
            <p className="text-sm text-muted">
              Genre and rating filters apply to the current page of search results.
            </p>
          )}
        </div>
        {content}
      </section>
    </div>
  );
}
