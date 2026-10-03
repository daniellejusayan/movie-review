export function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-20 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-ink" />
      <p>{label}</p>
    </div>
  );
}

// Used for errors and empty results.
export default function StateMessage({ title, message, actionLabel, onAction }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {message && <p className="mt-2 text-muted">{message}</p>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 cursor-pointer rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
