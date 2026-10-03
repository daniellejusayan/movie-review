const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w342') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;
export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;
export const profileUrl = (path, size = 'w185') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const getYear = (date) => (date ? date.slice(0, 4) : null);

export const formatDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Release date unknown';

export const formatRuntime = (minutes) =>
  minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : null;

export const formatMoney = (amount) =>
  amount > 0 ? `$${amount.toLocaleString('en-US')}` : null;

// TMDB scores are out of 10; our stars are out of 5.
export const toFiveStars = (voteAverage) => (voteAverage || 0) / 2;

// Turns an RTK Query error into something a person can act on.
export function describeError(error) {
  if (error?.status === 404) {
    return { title: 'Movie not found', message: "TMDB doesn't have a movie with that ID." };
  }
  if (error?.status === 401) {
    return {
      title: 'API key rejected',
      message: 'TMDB did not accept the API key. Check VITE_TMDB_API_KEY in your .env file and restart the dev server.',
    };
  }
  if (error?.status === 429) {
    return { title: 'Too many requests', message: 'TMDB is rate limiting us. Wait a moment and try again.' };
  }
  if (error?.status === 'CUSTOM_ERROR') {
    return { title: 'API key missing', message: error.error };
  }
  if (error?.status === 'FETCH_ERROR') {
    return { title: "Can't reach TMDB", message: 'Check your internet connection and try again.' };
  }
  return {
    title: 'Something went wrong',
    message: error?.data?.status_message ?? 'Please try again.',
  };
}

// Rating filter options. Values are TMDB's 0-10 scale.
export const RATING_OPTIONS = [
  { label: 'Any rating', value: 0 },
  { label: '3 stars & up', value: 6 },
  { label: '3.5 stars & up', value: 7 },
  { label: '4 stars & up', value: 8 },
];
