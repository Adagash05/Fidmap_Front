import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { boards as boardsApi, WORKSPACE_ID } from "../components/Api";
import { useAuth } from "../hooks/useAuth";

const BoardContext = createContext(null);

/*
 * Owns the workspace's board COLLECTION only — not "which board is
 * currently selected" (that's the URL's job via useParams(), see Board.jsx).
 * One loading mechanism (loadBoards), called once when staff auth is
 * confirmed and again whenever create/update/remove succeed.
 *
 * Uses the signed-in staff member's OWN workspace (currentUser.workspaceId,
 * populated by AuthContext from GET /feedback/user/me) — not the static
 * VITE_WORKSPACE_ID env default. That env var only exists as a last-resort
 * fallback for the sliver of a moment before /me resolves; relying on it
 * as the primary source would mean every staff user, regardless of which
 * workspace they actually belong to, sees whichever workspace the env var
 * happens to point at — a real cross-tenant bug in a multi-tenant app.
 *
 * GET /board/get-all/{workspace-id} requires a staff token (it's not in the
 * backend's public-GET allow-list), so anonymous visitors simply never see
 * a board collection here — that's expected, not an error state.
 */
export function BoardProvider({ children }) {
  const { isStaff, currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId ?? WORKSPACE_ID;

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBoards = useCallback(async () => {
    if (!isStaff) {
      setBoards([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await boardsApi.getAll(workspaceId);
      setBoards(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, [isStaff, workspaceId]);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) loadBoards();
    });

    return () => {
      cancelled = true;
    };
  }, [loadBoards]);

  const createBoard = useCallback(
    async (data) => {
      const created = await boardsApi.create(workspaceId, data);
      await loadBoards();
      return created;
    },
    [loadBoards, workspaceId],
  );

  const updateBoard = useCallback(
    async (boardId, data) => {
      const updated = await boardsApi.edit(boardId, data);
      await loadBoards();
      return updated;
    },
    [loadBoards],
  );

  const removeBoard = useCallback(
    async (boardId) => {
      await boardsApi.remove(boardId);
      await loadBoards();
    },
    [loadBoards],
  );

  const value = useMemo(
    () => ({
      boards,
      loading,
      error,
      reloadBoards: loadBoards,
      createBoard,
      updateBoard,
      removeBoard,
    }),
    [boards, loading, error, loadBoards, createBoard, updateBoard, removeBoard],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export default BoardContext;
