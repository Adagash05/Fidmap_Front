# Fidmap — backend contract notes

Written after reading the actual Spring Boot source (`com.amsal.fidmap`).
These are gaps/inconsistencies the frontend had to work around or can't
fully solve without a backend change — not guesses.

## 1. ~~Comments have no author or timestamp~~ — RESOLVED

`CommentDto` now returns `endUserName` and `createdAt`. **Follow-up bug
found and fixed separately**: `createdAt` existed on the field but was
never actually set in `CommentService.createComment()` — always `null`
despite looking wired up. Fixed with `comment.setCreatedAt(LocalDate.now())`.
See `BACKEND_FIXES.md` for the full note. `IdeaContext`'s comment list now
shows the author name again (it had been stripped out when this gap was
first discovered, to avoid displaying a fabricated "Someone").

## 2. ~~`EndUserDto.id` is typed `Long`, but `EndUser`'s real key is a `UUID`~~ — RESOLVED

`EndUserDto.id` is now `UUID`, matching the entity — confirmed by reading
the current source. This unblocks comment-deletion support in principle
(there's now a real id to work with), though that UI still isn't built —
it wasn't the focus of this pass, and the delete endpoint's path shape
(`/comment/end-user/{end-user-id}/comment/{comment-id}`, no leading slash
on the method-level mapping) hasn't been verified against a running
server. Flagging as a possible follow-up, not blocking anything shipped.

## 3. ~~No bulk "have I voted" endpoint~~ — RESOLVED

`GET /vote/board/{boardId}?endUserEmail=...` now exists, returning vote
state for every post on a board in one call. **Follow-up bug found and
fixed separately**: it wasn't actually on `SecurityConfig`'s public
allow-list, so it would have 401'd for the anonymous visitors it's meant
to serve — added `/vote/board/**` to the public GET matchers. `Board.jsx`
now calls this once per board load (merged with the feedback list) instead
of defaulting every post to "not voted."

## 4. ~~Listing boards by workspace requires staff auth~~ — RESOLVED for public discovery

`GET /board/get-all/{workspace-id}` (the full board list) is still
staff-only, correctly — that's the board-management endpoint. But public
board *discovery* is now solved by a separate, actually-public endpoint;
see #8.

## 5. ~~`/feedback/user/me` sits under a publicly-allowlisted path~~ — RESOLVED

`SecurityConfig.PUBLIC_URLS` included `/feedback/user/**`, which — because
Spring Security matches rules in order and the first match wins — made
`/feedback/user/me` effectively public despite an explicit
`.requestMatchers("/feedback/user/me").authenticated()` rule further down;
that rule was unreachable. Fixed: removed the broad `/feedback/user/**`
public entry (nothing else lives under that path), so the explicit
`.authenticated()` rule now actually applies.

## 6. Survey is not integrated into the frontend

The backend has a complete Survey domain (`Survey`, `SurveyQuestion`,
`SurveyOption`, `SurveyResponse`, `SurveyAnswer`, plus management
controllers). It wasn't wired into this pass — the controllers, DTOs, and
request/response shapes need a dedicated contract review (there are ~6
related controllers) before a Survey UI is built, and that's a large enough
surface that bolting it on without that review would risk exactly the kind
of guessed-contract bugs this pass was fixing elsewhere. No Survey route is
registered in the frontend, so nothing links to a broken page.

## 7. Auth response shapes are inconsistent between endpoints

- `POST /auth/sign-in` (register) returns `ApiResponse<UserDto>` — the token
  is `data.accessToken` (camelCase, wrapped in the standard envelope).
- `POST /auth/log-in` returns a bare `AuthenticationResponse` — the token is
  `access_token` (snake_case, **not** wrapped in `{success,message,data}`).

Both are handled correctly by the frontend now, but this is worth
normalizing on the backend at some point so every endpoint has one response
shape convention.

## 8. Public board discovery — RESOLVED

`GET /board/public/workspace/{workspace-id}` now exists (public, filtered
to `isPublic = true`), exactly as requested below. Wired up in
`Api.js` (`boards.getPublic`) and used by `Dashboard.jsx` for anonymous
visitors and by `PublicPortal.jsx`. The old `VITE_DEFAULT_PUBLIC_BOARD_ID`
env-var workaround has been removed — it's no longer needed.

Also found and fixed while wiring this up: `boards.getAll()` (the
*staff* board list) was calling the backend without `auth: true` despite
`GET /board/get-all/{workspace-id}` requiring a staff token — it had been
silently 401ing. Fixed in `Api.js`.

## 9. Multi-board architecture note (frontend)

The frontend treats a workspace as owning many boards. Every board-scoped
route is keyed by `:boardId` from the URL — there's no hardcoded board id
anywhere in routing or data-fetching. `BoardContext` owns the board
*collection* only; "which board is currently selected" is derived from the
URL, not a second parallel piece of state, per the architecture note in
`BoardContext.jsx`.

Roadmap and Changelog are workspace-level per the actual backend
(`RoadmapController`'s `/roadmap/workspace/{id}`, `ChangeLogController`'s
`/workspaces/{id}/changelogs`), and now have their own top-level routes —
`/roadmap` and `/changelog` — rather than being nested under a board. An
earlier pass nested them under `/board/:boardId/roadmap` for navigational
convenience; that was a mistake (it implied a board-scoped relationship
that doesn't exist on the backend) and has been corrected. They're always
reachable from the top nav (`Header.jsx`), regardless of which board, if
any, is currently open.

## 10. Public portal readiness — capability-by-capability audit — both blocking gaps now RESOLVED

Originally: building `/p/:workspaceSlug` needed workspace-slug resolution,
which didn't exist. **Both real gaps identified below are now fixed**:

| Capability | Status | Endpoint |
|---|---|---|
| Resolve a workspace by public slug | **RESOLVED** | `GET /workspace/slug/{slug}` — added `Workspace.slug`, `WorkspaceService.generateUniqueSlug()`, and this endpoint. Public. |
| Public board retrieval (single) | EXISTS | `GET /board/{id}` — public |
| Public board retrieval (list, for a workspace) | **RESOLVED** | `GET /board/public/workspace/{workspaceId}` — see #8 |
| Public feedback retrieval | EXISTS | `GET /feedback/board/{boardId}` — public |
| Public feedback creation | EXISTS | `POST /feedback/board/{boardId}` — public |
| Public voting | EXISTS | `POST /vote/{feedbackId}` — public |
| Public bulk vote status | **RESOLVED** | `GET /vote/board/{boardId}?endUserEmail=` — see #3 |
| Public comments (read + create) | EXISTS | `GET/POST /comment/{feedbackId}` — public |
| Public roadmap retrieval | EXISTS | `GET /roadmap/**` — public |
| Public changelog retrieval | EXISTS | `GET /workspaces/{id}/changelogs` — public |

**Built this session:** a minimal, real `/p/:workspaceSlug` page
(`src/pages/PublicPortal.jsx`) — resolves the workspace by slug, lists its
public boards, links into the existing `/board/:boardId` page for the
actual feedback experience (search, submit, vote, comment — all already
functional there). Settings now shows the workspace's slug and a
copy/open-able portal URL.

**Deliberately not built this session** (scope, not a blocker):
- A dedicated `{slug}.fidmap.com` subdomain — the path-based `/p/:slug` is
  the honest MVP version; subdomain routing needs production DNS/hosting
  decisions this session can't make.
- Roadmap/changelog nested under `/p/:slug/roadmap` — they're
  workspace-level already and reachable at the top-level `/roadmap` and
  `/changelog`, which `PublicPortal.jsx` doesn't duplicate.
- A marketing site distinct from the board-management Dashboard — `/`
  still doubles as both, per earlier passes' scope decisions.

## 11. Roadmap item admin CRUD (new)

`RoadmapItemController` supports create/update/status-patch/delete, all
used now from `/roadmap`'s staff UI:

- `POST /roadmap/item/{roadmapId}` — create. Body: `AddItemRequest {title,
  description, status, feedbackPost}`.
- `PUT /roadmap/item/{itemId}` — full edit. Body: `UpdateItemRequest
  {title, description, targetDate, status}`. **Note:** this endpoint does
  not accept `feedbackPost`, so related feedback can only be attached at
  creation time, not added/changed afterward — the edit form doesn't offer
  a feedback picker for that reason.
- `PATCH /roadmap/item/{itemId}?status=...` — status-only change, used for
  quick column moves.
- `DELETE /roadmap/item/{itemId}` — delete, with a confirmation dialog.

**Untested assumption:** `AddItemRequest.feedbackPost` and
`RoadmapItemDto.feedbackPost` are typed as full `FeedbackPost` entities on
the backend, not ids. The frontend sends `[{ id }]` per selected post and
relies on Jackson/JPA resolving that as an entity reference (a standard
pattern for JPA `@ManyToMany`/`@OneToMany` request DTOs, but it depends on
`FeedbackPost` having a no-arg constructor and `id` setter — not verified
against a running backend). If this doesn't deserialize as expected, the
fix is either exposing a lighter `List<Long> feedbackPostIds` on
`AddItemRequest`, or confirming `FeedbackPost`'s Jackson config.

## 12. ~~Changelog entry admin CRUD — no edit-content endpoint~~ — RESOLVED

`ChangeLogController` now supports full create/edit/status-patch/delete,
all used from `/changelog`'s staff UI:

- `POST /workspaces/{workspaceId}` — create. Body: `ChangeLogRequest
  {title, content, status, publishedAt, userId}`.
- `PUT /workspaces/changelog/{id}` — full edit (new). Body:
  `UpdateChangeLogRequest {title, content, status, publishedAt}`. Wired to
  a real "Edit" action in each entry's menu.
- `PATCH /workspaces/changelog/{id}?status=DRAFT|PUBLISHED` — publish/unpublish.
- `DELETE /workspaces/{id}` — delete, with a confirmation dialog.

One caveat: the edit endpoint's authorization check doesn't verify the
caller belongs to *this* entry's specific workspace (checks workspace
membership in general, not against `changeLog.getWorkspace()`) — a
workspace-isolation gap, tracked in `BACKEND_FIXES.md`, not an API
contract gap, so not duplicated here.

Staff see DRAFT entries in `/changelog` (so they have something to
publish); public visitors continue to see only `PUBLISHED` entries.

## 13. Staff dashboard (`/dashboard`) — no stats endpoint, no timestamps

`/dashboard` computes its stats/recent-feedback client-side rather than
from a dedicated analytics endpoint — none exists, and this task
explicitly said not to invent one. It does one `GET /feedback/board/{id}`
per board (bounded by board count) rather than anything unbounded.

Two real limitations worth knowing:

- **No `createdAt` on `FeedbackDto` or `RoadmapItemDto`.** True recency
  can't be shown at all — not even approximated. Ids are now `UUID` (see
  `BACKEND_FIXES.md`'s ID-type note), so the earlier id-descending
  approximation this doc used to describe is gone; "recent feedback" is
  just the board's returned order, undecorated. Changelog *does* have
  `publishedAt`, so its "recent" section is genuinely date-sorted.
- **No deep link to a single feedback post.** `Board.jsx` doesn't support
  opening a specific feedback item via a URL param (only `/board/{id}`),
  so "Recent feedback" links go to the board, not the exact post.

**Requested change** — add `createdAt` to `FeedbackDto` and
`RoadmapItemDto` for genuine recency sorting.

## 14. Team / user management — contract now mostly correct, one likely-critical bug

`POST /feedback/user/{workspaceId}/new-user` (create), `GET
.../get-all-users` (list), `PUT`/`DELETE /feedback/user/{userId}/user`
(edit/delete) are wired up in Settings → Team. Most of the original
contract issues are resolved — see `BACKEND_FIXES.md`'s "Resolved since
the last audit" section (password now hashed and persisted, `role`
exposed on `UserDto`, delete uses a real path variable, list uses GET).

`UserDto` now exposing `role` means the frontend can finally gate the
Team tab's *visibility* client-side (`Settings.jsx` — only rendered for
`currentUser.role === "OWNER"`), on top of the backend's own OWNER-only
enforcement, which remains the actual authorization boundary.

**One likely-critical issue remains**, found this pass:
`UserController` declares two methods both mapped to `PUT
/feedback/user/{user-id}/user` — an ambiguous Spring MVC mapping that (if
this reflects the actual running application) throws
`IllegalStateException` at startup, meaning the backend may not currently
boot at all. See `BACKEND_FIXES.md` for detail — this is a guess based on
standard Spring behavior, not a verified runtime observation, since this
session cannot run the backend.
