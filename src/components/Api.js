// Talks to the fidmap Spring Boot backend.
// See BACKEND_FIXES.md for the exact backend changes this contract assumes.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// VITE_API_BASE_URL=https://api.fidmap.co

export const WORKSPACE_ID = import.meta.env.VITE_WORKSPACE_ID || null;

const TOKEN_KEY = "fidmap.access_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      `Couldn't reach the backend at ${BASE_URL}. Is it running, and does CorsConfig allow this origin?`,
      0,
    );
  }

  const text = await res.text();
  const payload = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (payload && (payload.message || payload?.data?.error)) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  // Most endpoints wrap responses in { success, message, data }, but some
  // (billing) return raw values — a bare number, or a DTO with no
  // envelope at all. `"data" in payload` throws a TypeError if payload is
  // a primitive (e.g. the raw `7` from GET /api/billing/trial), so guard
  // with a typeof check before touching it.
  return typeof payload === "object" && payload !== null && "data" in payload
    ? payload.data
    : payload;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/* ------------------------------- auth (staff) ------------------------------ */

export const auth = {
  logIn: (email, password) =>
    request("/auth/log-in", { method: "POST", body: { email, password } }),

  // Creates the first staff user + workspace in one call. Field names match
  // MultiStepForm's payload: { firstUser: { fullName, email, password }, dto: { name } }.
  register: (data) => request("/auth/sign-in", { method: "POST", body: data }),

  // Always succeeds with the same message regardless of whether the email
  // exists — backend enforces this, frontend doesn't need to guess.
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: { email } }),

  resetPassword: (token, newPassword) =>
    request("/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    }),
};

/* --------------------------------- workspace --------------------------------- */
// GET /workspace/{id} is NOT in the backend's public-GET allow-list, so this
// requires a staff token. Only call it from authenticated (staff) screens.

export const workspace = {
  get: (workspaceId = WORKSPACE_ID) =>
    request(`/workspace/${workspaceId}`, { auth: true }),

  // Public: resolves a workspace by its slug, no staff token required.
  // Powers the public portal (see docs/backend-api-requirements.md #10 —
  // this was the missing piece; it now exists).
  getBySlug: (slug) => request(`/workspace/slug/${slug}`),
};

/* ----------------------------------- users ------------------------------------ */
// GET /feedback/user/me returns the signed-in staff user. Used to restore/verify
// auth state after a page refresh.

export const users = {
  me: () => request("/feedback/user/me", { auth: true }),

  // OWNER-only on the backend (role check happens server-side).
  // AddUserRequest: { fullName, email, password } — password IS hashed
  // and persisted, but there's no `role` field on this request at all:
  // every created user is hardcoded to MEMBER server-side regardless of
  // what's sent. The frontend doesn't offer a role picker on create for
  // that reason — it would be a control that does nothing. Role can be
  // changed afterward via Edit (UpdateUserRequest, which does respect it).
  create: (workspaceId, { fullName, email, password }) =>
    request(`/feedback/user/${workspaceId}/new-user`, {
      method: "POST",
      auth: true,
      body: { fullName, email, password },
    }),

  // Fixed since the last audit — this is now a real GET.
  list: (workspaceId) =>
    request(`/feedback/user/${workspaceId}/get-all-users`, {
      method: "GET",
      auth: true,
    }),

  // Fixed since the last audit — the path variable is now correctly
  // named/bound as the user id (was previously mislabeled "workspace-id"
  // in the URL while actually being read as userId).
  //
  // CRITICAL BACKEND BUG (see BACKEND_FIXES.md): UserController currently
  // declares TWO methods both mapped to `PUT /feedback/user/{user-id}/user`
  // (an unused `getUser` alongside the real `editUserInWorkspace`) — an
  // ambiguous Spring MVC mapping, which will throw
  // IllegalStateException at application startup and likely means the
  // backend does not currently boot at all. This call is implemented
  // against the intended contract (matching `editUserInWorkspace`'s
  // signature) but cannot be verified working until that's fixed.
  update: (userId, { fullName, email, role }) =>
    request(`/feedback/user/${userId}/user`, {
      method: "PUT",
      auth: true,
      body: { fullName, email, role },
    }),

  // Fixed since the last audit — DELETE now correctly declares
  // @PathVariable("user-id"), so this is a clean path-based call, no
  // query param workaround needed anymore.
  remove: (userId) =>
    request(`/feedback/user/${userId}/user`, {
      method: "DELETE",
      auth: true,
    }),

  // Authenticated user is derived from the JWT server-side — no userId
  // in the URL/body.
  changePassword: ({ currentPassword, newPassword, confirmPassword }) =>
    request("/feedback/user/change-password", {
      method: "PUT",
      auth: true,
      body: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    }),
};

/* ---------------------------------- board ----------------------------------- */

export const boards = {
  // Get every board belonging to a workspace.

  getAll: (workspaceId = WORKSPACE_ID) =>
    request(`/board/get-all/${workspaceId}`, { auth: true }),

  // Public: boards where isPublic = true, no staff token required. Powers
  // public board discovery (replaces the old VITE_DEFAULT_PUBLIC_BOARD_ID
  // workaround, which is no longer needed now that this endpoint exists).
  getPublic: (workspaceId = WORKSPACE_ID) =>
    request(`/board/public/workspace/${workspaceId}`),

  // Get one board.
  get: (boardId) => request(`/board/${boardId}`),

  // Create a board inside a workspace.
  create: (workspaceId, data) =>
    request(`/board/${workspaceId}`, {
      method: "POST",
      auth: true,
      body: data,
    }),

  // Edit a board.
  edit: (boardId, data) =>
    request(`/board/${boardId}`, {
      method: "PUT",
      auth: true,
      body: data,
    }),

  // Change board visibility.
  setPublic: (boardId, isPublic) =>
    request(`/board/board-is-public/${boardId}`, {
      method: "PATCH",
      auth: true,
      body: isPublic,
    }),

  // Delete a board.
  remove: (boardId) =>
    request(`/board/${boardId}`, {
      method: "DELETE",
      auth: true,
    }),
};

/* -------------------------------- feedback ----------------------------------- */

export const feedback = {
  list: (boardId) => request(`/feedback/board/${boardId}`),

  get: (feedbackId, boardId) =>
    request(`/feedback/board/${boardId}/feedback/${feedbackId}`),

  create: ({ title, description, name, email }, boardId) =>
    request(`/feedback/board/${boardId}`, {
      method: "POST",
      body: { title, description, endUser: { name, email } },
    }),

  setStatus: (feedbackId, status, boardId) =>
    request(
      `/feedback/board/${boardId}/feedback/${feedbackId}/status?status=${status}`,
      { method: "PATCH", auth: true },
    ),

  edit: (feedbackId, { title, description }, boardId) =>
    request(`/feedback/board/${boardId}/feedback/${feedbackId}`, {
      method: "PUT",
      auth: true,
      body: { title, description },
    }),

  remove: (feedbackId, boardId) =>
    request(`/feedback/board/${boardId}/feedback/${feedbackId}`, {
      method: "DELETE",
      auth: true,
    }),
};

/* --------------------------------- comments ----------------------------------- */

export const comments = {
  list: (feedbackId) => request(`/comment/${feedbackId}`),

  create: (feedbackId, { message, name, email }) =>
    request(`/comment/${feedbackId}`, {
      method: "POST",
      body: { message, endUser: { name, email } },
    }),
};

/* ----------------------------------- votes ------------------------------------- */
// Matches the real VoteController/VoteRequest contract.

export const votes = {
  // Body must match VoteRequest: { endUserName, endUserEmail }.
  toggle: (feedbackId, { name, email }) =>
    request(`/vote/${feedbackId}`, {
      method: "POST",
      body: { endUserName: name, endUserEmail: email },
    }),

  // Lets the UI know, for one post, whether this visitor has already voted.
  status: (feedbackId, email) =>
    request(
      `/vote/${feedbackId}${email ? `?endUserEmail=${encodeURIComponent(email)}` : ""}`,
    ),

  // Bulk: vote state for every post on a board in one request — used on
  // board load instead of N individual status() calls.
  // Returns [{ feedbackPostId, voteCount, votedByCurrentEndUser }, ...].
  boardStatus: (boardId, email) =>
    request(`/vote/board/${boardId}?endUserEmail=${encodeURIComponent(email)}`),
};

/* --------------------------------- roadmap -------------------------------------- */
// One roadmap per workspace (Roadmap.workspace is @OneToOne, auto-created).
// RoadmapItemController's create/update/patch/delete all need the roadmap's
// own id (not the workspace id), so `get()` exposes both.

export const roadmap = {
  // { id: <roadmapId>, items: [...] }
  get: async (workspaceId = WORKSPACE_ID) => {
    const result = await request(`/roadmap/workspace/${workspaceId}`);
    return { id: result?.id ?? null, items: result?.roadmapItems ?? [] };
  },

  // Back-compat convenience for callers that only want the items array.
  items: async (workspaceId = WORKSPACE_ID) => {
    const result = await request(`/roadmap/workspace/${workspaceId}`);
    return result?.roadmapItems ?? [];
  },
};

/* ------------------------------ roadmap items ------------------------------------ */
// AddItemRequest.feedbackPost / RoadmapItemDto.feedbackPost are full
// FeedbackPost entities on the backend, not ids — when linking, we send
// [{ id }] and let JPA resolve the reference (standard Spring/JPA pattern).

export const roadmapItems = {
  // roadmapId is the Roadmap's own id (roadmap.get().id), not the workspace id.
  create: (roadmapId, { title, description, status, feedbackPostIds = [] }) =>
    request(`/roadmap/item/${roadmapId}`, {
      method: "POST",
      auth: true,
      body: {
        title,
        description,
        status,
        feedbackPost: feedbackPostIds.map((id) => ({ id })),
      },
    }),

  // itemId here despite the backend's "roadmap-id" path-variable name — it's
  // actually the roadmap item's id (see RoadmapItemController).
  update: (itemId, { title, description, targetDate, status }) =>
    request(`/roadmap/item/${itemId}`, {
      method: "PUT",
      auth: true,
      body: { title, description, targetDate, status },
    }),

  setStatus: (itemId, status) =>
    request(`/roadmap/item/${itemId}?status=${status}`, {
      method: "PATCH",
      auth: true,
    }),

  remove: (itemId) =>
    request(`/roadmap/item/${itemId}`, { method: "DELETE", auth: true }),
};

/* -------------------------------- changelog -------------------------------------- */
// ChangeLogController now has a real update-content endpoint (added since
// the last audit): PUT /workspaces/changelog/{id}. Note its authorization
// check (verified against source) only confirms the caller belongs to
// *some* workspace, not that this specific changelog entry belongs to
// *their* workspace — a cross-tenant edit risk, see BACKEND_FIXES.md.
// Not something the frontend can close on its own.

export const changelog = {
  list: (workspaceId = WORKSPACE_ID) =>
    request(`/workspaces/${workspaceId}/changelogs`),

  get: (changelogId) => request(`/workspaces/changelog/${changelogId}`),

  // ChangeLogRequest: { title, content, status, publishedAt, userId }.
  create: (workspaceId, { title, content, status, publishedAt, userId }) =>
    request(`/workspaces/${workspaceId}`, {
      method: "POST",
      auth: true,
      body: { title, content, status, publishedAt, userId },
    }),

  // UpdateChangeLogRequest: { title, content, status, publishedAt }.
  update: (changelogId, { title, content, status, publishedAt }) =>
    request(`/workspaces/changelog/${changelogId}`, {
      method: "PUT",
      auth: true,
      body: { title, content, status, publishedAt },
    }),

  setStatus: (changelogId, status) =>
    request(`/workspaces/changelog/${changelogId}?status=${status}`, {
      method: "PATCH",
      auth: true,
    }),

  remove: (changelogId) =>
    request(`/workspaces/${changelogId}`, { method: "DELETE", auth: true }),
};

/* ---------------------------------- billing ----------------------------------- */
// Contract verified against BillingController/BillingService directly —
// these responses are NOT wrapped in the usual {success,message,data}
// envelope (raw SubscriptionResponse / Long / CheckoutResponse / 204), and
// checkout/cancel take query params, not a JSON body. request() already
// passes raw payloads through unchanged when there's no "data" key, so no
// special-casing is needed here.
//
// Known gaps in the current backend (see BACKEND_FIXES.md):
// - No yearly pricing exists at all — PaddleConfig.Prices only has one
//   price per plan (explicitly commented "Recurring monthly"), and
//   checkout takes no interval param. There is no way to actually charge
//   yearly right now.
// - getSubscription/getTrialDaysRemaining/cancelSubscription never call
//   WorkspaceAuthorizationService.requireBillingAccess — only checkout
//   does. Any authenticated staff user (any workspace, any role) can
//   currently view or cancel any other workspace's subscription by UUID.
// - requireBillingAccess allows OWNER *or* ADMIN; this frontend gates the
//   Subscription tab to OWNER only per what was asked for, so this is a
//   (harmless, permissive) mismatch worth knowing about.
export const billing = {
  getSubscription: (workspaceId) =>
    request(`/api/billing/subscription?workspaceId=${workspaceId}`, {
      auth: true,
    }),

  // Raw number of days remaining in the trial (0 once expired/not trialing).
  getTrialDaysRemaining: (workspaceId) =>
    request(`/api/billing/trial?workspaceId=${workspaceId}`, { auth: true }),

  // Effective plan limits/features (maxTeamMembers, maxBoards, ...,
  // privateBoards, removeFidmapBranding) for the workspace's CURRENT
  // billing plan — the backend's PlanEntitlementService/PlanDataInitializer
  // are the source of truth for these numbers, not this frontend. A null
  // maxX means unlimited. Any authenticated staff member of the workspace
  // may call this (not OWNER-only).
  getEntitlements: (workspaceId) =>
    request(`/api/billing/entitlements?workspaceId=${workspaceId}`, {
      auth: true,
    }),

  // plan must be one of the backend's actual BillingPlan enum values:
  // STARTUP_MONTHLY | STARTUP_YEARLY | BUSINESS_MONTHLY | BUSINESS_YEARLY |
  // LIFETIME. See constants/pricing.js for the UI-key -> BillingPlan map.
  createCheckout: (workspaceId, plan) =>
    request(
      `/api/billing/checkout?plan=${encodeURIComponent(plan)}&workspaceId=${workspaceId}`,
      { method: "POST", auth: true },
    ),

  // Changes an EXISTING active recurring (Startup/Business) subscription to
  // a different recurring plan via Paddle — no new checkout/subscription is
  // created. The backend does not update the local plan synchronously; it
  // calls Paddle and waits for Paddle's webhook to confirm the change, so
  // callers should re-fetch getSubscription() afterward rather than assume
  // the new plan is active. Not valid for LIFETIME (a one-time purchase,
  // not a Paddle subscription) or for non-ACTIVE statuses.
  changePlan: (workspaceId, plan) =>
    request(
      `/api/billing/subscription/plan?workspaceId=${workspaceId}&plan=${encodeURIComponent(plan)}`,
      { method: "PATCH", auth: true },
    ),

  cancelSubscription: (workspaceId) =>
    request(`/api/billing/cancel?workspaceId=${workspaceId}`, {
      method: "POST",
      auth: true,
    }),
};
