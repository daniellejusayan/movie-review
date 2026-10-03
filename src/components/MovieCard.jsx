import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StarRating from './StarRating';
import { getYear, posterUrl, toFiveStars } from '../utils/tmdb';

export default function MovieCard({ movie, genresById }) {
  const userRating = useSelector((state) => state.ratings[movie.id]);
  const poster = posterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const genreNames = (movie.genre_ids ?? [])
    .map((id) => genresById[id])
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-line bg-white"
    >
      <div className="aspect-[2/3] bg-ink/10">
        {poster ? (
          <img
            src={poster}
            alt={`Poster for ${movie.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">
            No poster available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug group-hover:underline">
          {movie.title}
        </h3>
        <p className="text-sm text-muted">{year ?? 'Year unknown'}</p>
        <p className="text-sm text-muted">{genreNames.join(', ') || 'No genre listed'}</p>

        <div className="mt-auto flex flex-col gap-1 pt-2">
          {movie.vote_count > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating value={toFiveStars(movie.vote_average)} size="sm" label="Public rating" />
              <span className="text-xs text-muted">{toFiveStars(movie.vote_average).toFixed(1)}</span>
            </div>
          ) : (
            <p className="text-xs text-muted">No public ratings yet</p>
          )}
          {userRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={userRating} size="sm" tone="mine" label="Your rating" />
              <span className="text-xs font-medium text-mine">Your rating</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
