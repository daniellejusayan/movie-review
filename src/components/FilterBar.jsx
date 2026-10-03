import { RATING_OPTIONS } from '../utils/tmdb';

const selectClass = 'w-full rounded-md border border-line bg-white px-3 py-2 text-sm';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i);

// Fully controlled: it owns no state, it only shows the values it is given and
// reports changes through callback props.
export default function FilterBar({
  genres,
  genreId,
  year,
  minVoteAverage,
  hasActiveFilters,
  onGenreChange,
  onYearChange,
  onRatingChange,
  onReset,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
      <div>
        <label htmlFor="filter-genre" className="mb-1 block text-sm font-medium">
          Genre
        </label>
        <select
          id="filter-genre"
          value={genreId}
          onChange={(e) => onGenreChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-year" className="mb-1 block text-sm font-medium">
          Release year
        </label>
        <select
          id="filter-year"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Any year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-rating" className="mb-1 block text-sm font-medium">
          Public rating
        </label>
        <select
          id="filter-rating"
          value={minVoteAverage}
          onChange={(e) => onRatingChange(e.target.value)}
          className={selectClass}
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="cursor-pointer rounded-md border border-ink px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset filters
      </button>
    </div>
  );
}
