const STORAGE_KEY = 'movie-review:ratings';

// Reads saved ratings. Never throws: corrupted or blocked storage just means
// "no ratings yet".
export function loadRatings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export function saveRatings(ratings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // Storage full or disabled (private mode): the app keeps working in memory.
  }
}
