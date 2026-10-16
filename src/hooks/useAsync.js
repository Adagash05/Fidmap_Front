import { useCallback, useEffect, useState } from "react";

/*
 * Tiny data-loading hook: runs `fn` whenever `deps` change (or reload() is
 * called) and exposes { data, loading, error, reload }. Ignores results of
 * superseded requests so a slow earlier response can never overwrite a newer one.
 */
export function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((previous) => ({ ...previous, loading: true, error: null }));

      try {
        const data = await fn();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (error) {
        if (!cancelled) setState({ data: null, loading: false, error });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  return { ...state, reload };
}
