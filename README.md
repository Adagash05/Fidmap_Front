# fidmap frontend

A feedback board SaaS frontend (React + Vite) for the fidmap Spring Boot
backend. A workspace owns many boards; each board has feedback posts, which
have comments and votes; roadmap and changelog are workspace-level.

## Setup

```bash
npm install
cp .env.example .env   # fill in your backend URL / workspace id
npm run dev
```

`npm run build` produces a production bundle in `dist/`.

## Project structure

```
src/
├── components/       Reusable pieces: BoardCard, Create/Edit/DeleteBoard
│                      modals, LoginModal, EmptyState, the Api.js client
├── context/           AuthContext (staff auth) and BoardContext (the
│                      workspace's board collection) — see the comment at
│                      the top of each file for what it owns
├── hooks/              useAuth(), useBoards() — thin wrappers around the
│                      contexts, split out for React Fast Refresh
├── pages/
│   ├── Dashboard.jsx  Workspace landing page — board grid + management
│   │                  for staff, a minimal fallback for public visitors
│   ├── Board/         A single board's feedback: search, sort, filter,
│   │                  submit, vote, comment
│   ├── Roadmap/       Workspace-level roadmap (see docs below)
│   ├── Changelog/      Workspace-level changelog
│   ├── Login/, Register/   Staff auth flows
│   └── Settings/       Signed-in staff account + workspace info
├── constants/STATUS.jsx   Feedback/roadmap status labels & colors
├── ProtectedRoute.jsx  Gates /settings behind staff auth
├── App.jsx             Routes
└── main.jsx             Provider tree + app bootstrap
```

## Architecture notes

- **Auth**: `AuthContext` is the single source of truth for staff auth. It
  verifies the stored token against `GET /feedback/user/me` on load rather
  than trusting `Boolean(localStorage.getItem(...))`.
- **Boards**: a workspace has many boards. `BoardContext` owns the board
  *collection* for the current workspace; which board is currently being
  viewed is derived from the URL (`:boardId`) wherever it's needed — there
  is no separate "current board" state that could disagree with the URL.
- **Public vs staff**: end users interact with boards via a lightweight
  name/email "identity" (see `IdentityContext`/`IdeaContext`), no login
  required. Staff sign in via JWT and get board management, status changes,
  and settings. `GET /board/get-all/{workspaceId}` requires a staff token,
  so anonymous visitors can't browse a board list — see
  `docs/backend-api-requirements.md` #8.

## Backend contract

`docs/backend-api-requirements.md` documents every place the frontend had
to work around a real gap or inconsistency in the backend contract (missing
comment author/timestamp, no public board-discovery endpoint, etc.) —
written from reading the actual Spring Boot source, not guessed.
