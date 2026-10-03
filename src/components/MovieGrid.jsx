import MovieCard from './MovieCard';

export default function MovieGrid({ movies, genresById }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <li key={movie.id} className="flex">
          <MovieCard movie={movie} genresById={genresById} />
        </li>
      ))}
    </ul>
  );
}
