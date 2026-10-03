import { useState } from 'react';

const SIZES = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-9 w-9' };
// "public" = TMDB's average score, "mine" = the user's own rating.
const TONES = { public: 'text-star', mine: 'text-mine' };

function StarShape({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5l2.94 6.07 6.56.9-4.8 4.62 1.2 6.6L12 17.5l-5.9 3.19 1.2-6.6L2.5 9.47l6.56-.9L12 2.5z" />
    </svg>
  );
}

// One component, two modes:
//  - read-only (no onChange): shows `value`, which may be fractional (3.7 stars)
//  - interactive (onChange given): clicking star n calls onChange(n)
export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  tone = 'public',
  label = 'Rating',
}) {
  const [hoverValue, setHoverValue] = useState(0); // only for the hover preview
  const interactive = typeof onChange === 'function';
  const shown = interactive && hoverValue ? hoverValue : value;

  const stars = [1, 2, 3, 4, 5].map((n) => {
    // How much of this star is filled: 0, between 0 and 1, or 1
    const fill = Math.max(0, Math.min(1, shown - (n - 1)));
    const star = (
      <span className="relative inline-block">
        <StarShape className={`${SIZES[size]} text-empty`} />
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <StarShape
            className={`${SIZES[size]} max-w-none ${interactive && hoverValue ? TONES.mine : TONES[tone]}`}
          />
        </span>
      </span>
    );

    if (!interactive) return <span key={n}>{star}</span>;

    return (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        onMouseEnter={() => setHoverValue(n)}
        onFocus={() => setHoverValue(n)}
        onBlur={() => setHoverValue(0)}
        aria-label={`Rate ${n} out of 5`}
        aria-pressed={value === n}
        className="cursor-pointer rounded p-0.5"
      >
        {star}
      </button>
    );
  });

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={`${label}: ${value.toFixed(1)} out of 5`}
        className="inline-flex gap-0.5"
      >
        {stars}
      </span>
    );
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex gap-1"
      onMouseLeave={() => setHoverValue(0)}
    >
      {stars}
    </div>
  );
}
