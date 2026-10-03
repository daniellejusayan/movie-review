export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const buttonClass =
    'cursor-pointer rounded-md border border-ink px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        className={buttonClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages.toLocaleString()}
      </span>
      <button
        type="button"
        className={buttonClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
