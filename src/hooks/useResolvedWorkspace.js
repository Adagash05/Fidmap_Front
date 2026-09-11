import { useEffect, useState } from "react";
import { workspace as workspaceApi } from "../components/Api";

/*
 * Resolves a workspace by its public slug (GET /workspace/slug/{slug},
 * public). Shared by every public-portal page (PublicPortal, PortalRoadmap,
 * PortalChangelog) so the resolution logic — and its loading/error states
 * — lives in one place instead of being copy-pasted per page.
 */
export function useResolvedWorkspace(slug) {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const result = await workspaceApi.getBySlug(slug);
        if (!cancelled) {
          setWorkspace(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setWorkspace(null);
          setError(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { workspace, loading, error };
}
