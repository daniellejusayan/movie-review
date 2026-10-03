import { useDispatch, useSelector } from 'react-redux';
import { clearRating, rateMovie } from '../features/ratings/ratingsSlice';
import StarRating from './StarRating';

// The user's own rating for one movie. Reads from and writes to the Redux
// ratings slice; the store takes care of saving to localStorage.
export default function UserRating({ movieId }) {
  const dispatch = useDispatch();
  const rating = useSelector((state) => state.ratings[movieId] ?? 0);

  const handleRate = (value) => {
    // Clicking the star you already picked removes your rating.
    if (value === rating) {
      dispatch(clearRating(movieId));
    } else {
      dispatch(rateMovie({ movieId, rating: value }));
    }
  };

  return (
    <div>
      <StarRating
        value={rating}
        onChange={handleRate}
        tone="mine"
        size="lg"
        label="Your rating"
      />
      <p className="mt-1 text-sm text-muted">
        {rating ? `You rated this ${rating} out of 5.` : 'Select a star to rate this movie.'}
        {rating > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearRating(movieId))}
            className="ml-2 cursor-pointer text-mine underline"
          >
            Clear rating
          </button>
        )}
      </p>
    </div>
  );
}
