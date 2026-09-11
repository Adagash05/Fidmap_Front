import { ApiError } from "../components/Api";

function ErrorBanner({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="fm-error-banner">
      <span>
        {error instanceof ApiError
          ? error.message
          : "Something went wrong talking to the backend."}
      </span>

      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default ErrorBanner;
