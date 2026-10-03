import { Link, useParams } from 'react-router-dom';
import { useGetMovieDetailsQuery } from '../api/tmdbApi';
import StarRating from '../components/StarRating';
import UserRating from '../components/UserRating';
import StateMessage, { Spinner } from '../components/StateMessage';
import {
  backdropUrl,
  describeError,
  formatDate,
  formatMoney,
  formatRuntime,
  getYear,
  posterUrl,
  profileUrl,
  toFiveStars,
} from '../utils/tmdb';

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function CastMember({ person }) {
  const photo = profileUrl(person.profile_path);
  return (
    <li className="w-28 shrink-0">
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-ink/10">
        {photo ? (
          <img src={photo} alt={person.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-bold text-muted">
            {person.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="mt-1 text-sm font-semibold leading-tight">{person.name}</p>
      <p className="text-xs leading-tight text-muted">{person.character || 'Role unknown'}</p>
    </li>
  );
}

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { data: movie, isLoading, isError, error, refetch } = useGetMovieDetailsQuery(movieId);

  const backLink = (
    <Link to="/" className="text-sm font-medium underline">
      Back to movies
    </Link>
  );

  if (isLoading) return <Spinner label="Loading movie…" />;

  if (isError) {
    const { title, message } = describeError(error);
    return (
      <div>
        {backLink}
        <StateMessage
          title={title}
          message={message}
          actionLabel={error?.status === 404 ? undefined : 'Try again'}
          onAction={refetch}
        />
      </div>
    );
  }

  const poster = posterUrl(movie.poster_path, 'w500');
  const backdrop = backdropUrl(movie.backdrop_path);
  const year = getYear(movie.release_date);
  const cast = movie.credits?.cast?.slice(0, 12) ?? [];
  const director = movie.credits?.crew?.find((person) => person.job === 'Director');
  const hasPublicRating = movie.vote_count > 0;

  return (
    <article className="flex flex-col gap-8">
      {backLink}

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="h-40 bg-ink sm:h-64">
          {backdrop && <img src={backdrop} alt="" className="h-full w-full object-cover opacity-80" />}
        </div>

        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:p-8">
          <div className="w-40 shrink-0 self-start overflow-hidden rounded-lg border-4 border-white bg-ink/10 shadow sm:w-52">
            {poster ? (
              <img src={poster} alt={`Poster for ${movie.title}`} className="aspect-[2/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center p-4 text-center text-sm text-muted">
                No poster available
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight">
                {movie.title}
                {year && <span className="font-medium text-muted"> ({year})</span>}
              </h1>
              {movie.tagline && <p className="mt-1 text-muted italic">{movie.tagline}</p>}
              {director && <p className="mt-1 text-sm">Directed by {director.name}</p>}
            </div>

            {movie.genres?.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <li key={genre.id} className="rounded-full border border-line px-3 py-1 text-sm">
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}

            <section>
              <h2 className="font-display text-lg font-bold">Overview</h2>
              <p className="mt-1 max-w-prose leading-relaxed">
                {movie.overview || 'No description is available for this movie yet.'}
              </p>
            </section>

            <div className="grid gap-6 border-t border-line pt-4 sm:grid-cols-2">
              <section>
                <h2 className="mb-1 font-display text-lg font-bold">Public rating</h2>
                {hasPublicRating ? (
                  <div className="flex items-center gap-3">
                    <StarRating value={toFiveStars(movie.vote_average)} size="lg" label="Public rating" />
                    <p className="text-sm text-muted">
                      <span className="font-semibold text-ink">
                        {toFiveStars(movie.vote_average).toFixed(1)}
                      </span>{' '}
                      / 5 from {movie.vote_count.toLocaleString()} votes
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted">No public ratings yet.</p>
                )}
              </section>

              <section>
                <h2 className="mb-1 font-display text-lg font-bold">Your rating</h2>
                <UserRating movieId={movie.id} />
              </section>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Release information</h2>
        <dl className="grid grid-cols-2 gap-4 rounded-lg border border-line bg-white p-5 sm:grid-cols-3">
          <Fact label="Release date" value={formatDate(movie.release_date)} />
          <Fact label="Status" value={movie.status} />
          <Fact label="Runtime" value={formatRuntime(movie.runtime)} />
          <Fact label="Original language" value={movie.original_language?.toUpperCase()} />
          <Fact label="Budget" value={formatMoney(movie.budget)} />
          <Fact label="Revenue" value={formatMoney(movie.revenue)} />
        </dl>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Cast</h2>
        {cast.length > 0 ? (
          <ul className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((person) => (
              <CastMember key={person.credit_id} person={person} />
            ))}
          </ul>
        ) : (
          <p className="text-muted">Cast information isn't available for this movie.</p>
        )}
      </section>
    </article>
  );
}
