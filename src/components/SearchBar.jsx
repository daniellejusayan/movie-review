import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

// Controlled input. `text` is what the user is typing; `value` is the search
// currently applied (from Redux). After a short pause we tell the parent via
// the onSearch callback prop.
export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value);
  const debouncedText = useDebounce(text, 400);

  // typing paused -> report the new search to the parent
  useEffect(() => {
    const trimmed = debouncedText.trim();
    if (trimmed !== value) onSearch(trimmed);
  }, [debouncedText]); // eslint-disable-line react-hooks/exhaustive-deps

  // the parent changed the search (e.g. "Reset filters") -> update the input
  useEffect(() => {
    if (value !== debouncedText.trim()) setText(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label htmlFor="movie-search" className="sr-only">
        Search movies by title
      </label>
      <input
        id="movie-search"
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search movies by title"
        className="w-full rounded-md border border-line bg-white px-4 py-3 text-base"
      />
    </div>
  );
}
