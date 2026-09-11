# fidmap backend — issue tracker

Verified against the actual current backend source (`fidmap__7_.zip`) —
not carried forward from memory or from stale doc claims. Frontend-only
work throughout; nothing here was changed on the backend side. Concrete
fixes are given as code for whoever applies them there.

---

## Resolved

Confirmed fixed by reading the current source directly:

- **Ambiguous route mapping on `PUT /{user-id}/user`.** Previously two
  methods (`getUser`, `editUserInWorkspace`) both mapped to the same
  path+method, which would throw `IllegalStateException` at Spring
  startup. Now `getUser` is `@GetMapping`, `editUserInWorkspace` is
  `@PutMapping` — no longer ambiguous.
- **Changelog edit didn't verify workspace ownership.**
  `ChangeLogService.editChangeLog()` now checks
  `existsByUserAndWorkspace` (or equivalent membership check) against the
  entry's actual workspace, matching the pattern already used by
  `editChangeLogStatus()`/`createChangeLog()`. A staff member from
  Workspace A can no longer edit Workspace B's changelog by id.
- **New workspace users had no password set** — `AddUserRequest` now
  includes `password`, hashed via `passwordEncoder.encode()` before save.
- **`UserDto` didn't expose `role`** — now present and populated. Powers
  the frontend's client-side gating of Team/Subscription tabs.
- **Delete-user endpoint bound its id from a query param** — now a real
  `@PathVariable("user-id")`.
- **List-users endpoint used POST for a read** — now `@GetMapping`.
- **`/feedback/user/me` authorization relied on matcher order** — the
  broad `/feedback/user/**` public entry is gone; the explicit
  `.authenticated()` rule on `/me` now actually applies.
- **No update-content endpoint for changelog entries** — `PUT
  /workspaces/changelog/{id}` now exists and is wired to a real Edit
  action in the frontend.
- **`EndUserDto.id` was typed `Long`** — now `UUID`, matching the entity.
- **ID types migrated `Long` → `UUID`** across `Workspace`, `Board`,
  `RoadmapItem`, `ChangeLog`, `FeedbackPost`, `Comment`, `EndUser`, `User`.
  (`Roadmap` itself remains `Long` — harmless, the frontend treats its id
  opaquely.)
- **Change password endpoint** — `PUT /feedback/user/change-password`
  exists, JWT-derived user, implemented and wired to a redesigned
  Security settings section frontend-side.

---

## Outstanding

### 1. Billing endpoints missing authorization on 3 of 4 operations — CRITICAL

`BillingService.createCheckout()` correctly calls
`workspaceAuthorizationService.requireBillingAccess(workspaceId)`.
`getSubscription()`, `getTrialDaysRemaining()`, and `cancelSubscription()`
do not — any authenticated user, from any workspace, can view or cancel
**any other workspace's** subscription by supplying its UUID.

**Fix** — add the same guard to all three:
```java
public SubscriptionResponse getSubscription(UUID workspaceId) {
    workspaceAuthorizationService.requireBillingAccess(workspaceId);
    // ...existing logic
}

public int getTrialDaysRemaining(UUID workspaceId) {
    workspaceAuthorizationService.requireBillingAccess(workspaceId);
    // ...existing logic
}

public void cancelSubscription(UUID workspaceId) {
    workspaceAuthorizationService.requireBillingAccess(workspaceId);
    // ...existing logic
}
```

### 2. No self-service "edit my own profile" endpoint for non-OWNER roles

`UserService.editUserInWorkspace()` requires the **caller's own** role to
be `OWNER` — regardless of which `userId` is being edited, including
their own. An `ADMIN` or `MEMBER` cannot edit their own name/email
through any existing endpoint; only an `OWNER` can (including editing
themselves, since the target-id check passes trivially when
`userId == currentUserId`).

This blocks "every authenticated role can manage their own profile" —
the frontend currently shows non-OWNER users their profile read-only with
an explanatory note, rather than wiring a form that would always 403.

**Fix** — add a genuinely self-service endpoint that doesn't check role,
only that the target is the caller themselves:
```java
@PutMapping("/me")
public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(
        @Valid @RequestBody UpdateUserRequest request) {

    UUID currentUserId = SecurityUtils.getCurrentUserId();
    return ResponseEntity.ok(userService.updateOwnProfile(currentUserId, request));
}
```
```java
@Transactional
public ApiResponse<UserDto> updateOwnProfile(UUID userId, UpdateUserRequest request) {
    User user = userRepository.findUserById(userId);
    if (user == null) throw new UserNotFoundException("user not found");

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    // deliberately do NOT allow role/workspace changes through this endpoint

    var saved = userRepository.save(user);
    return ApiResponse.success("profile updated", userMapper.toUserDto(saved));
}
```

### 3. No yearly Paddle price configured

`PaddleConfig.Prices` has exactly one price id per plan (commented
"Recurring monthly" / "One-time") and `BillingController#checkout` takes
no interval parameter — a yearly checkout cannot be requested at all
today. The frontend's pricing UI shows yearly figures for comparison but
disables/labels yearly checkout as unavailable rather than silently
charging monthly under a yearly label.

**Fix** — add yearly price ids and an interval parameter:
```java
// PaddleConfig
public record Prices(
    String startupMonthly, String startupYearly,
    String businessMonthly, String businessYearly,
    String lifetime
) {}
```
```java
// BillingController
@PostMapping("/checkout")
public ResponseEntity<CheckoutResponse> checkout(
        @RequestParam BillingPlan plan,
        @RequestParam(defaultValue = "MONTHLY") BillingInterval interval,
        @RequestParam UUID workspaceId) { ... }
```

### 4. `requireBillingAccess` permits ADMIN; product spec wants OWNER-only

`WorkspaceAuthorizationService.requireBillingAccess()` allows `OWNER` or
`ADMIN`. The frontend gates the Subscription tab to `OWNER` only per
explicit product requirement — stricter than the backend. Not a
vulnerability (frontend is the stricter side), but a policy mismatch
worth resolving one way or the other:

**Fix (if billing should be OWNER-only):**
```java
if (user.getRole() != Role.OWNER) {
    throw new AccessDeniedException("Only the workspace owner can manage billing");
}
```

### 5. `SubscriptionResponse` has no trial-end date, only a day-count

`Subscription` entity has `trialEndsAt`, but `SubscriptionResponse` DTO
doesn't expose it — only `GET /api/billing/trial`'s rounded day-count is
available. The frontend shows the day-count as-is, not a fabricated exact
date.

**Fix** — add `trialEndsAt` to `SubscriptionResponse`'s mapping.

### 6. Create-user endpoint ignores role choice (low severity)

`createNewUserInWorkspace` hardcodes `newUser.setRole(MEMBER)`;
`AddUserRequest` has no `role` field to receive a choice at all. Not
blocking — the (now-working) edit endpoint can promote a user afterward.

**Fix** — add `role: Role` to `AddUserRequest`, default to `MEMBER` if
absent.

### 7. Duplicate-email check throws the wrong exception type (cosmetic)

`createNewUserInWorkspace` throws `UserNotFoundException` (→ 404) for a
duplicate-email condition, which is semantically a 409 Conflict. Cosmetic
only — the frontend surfaces the message correctly regardless of status
code.

**Fix** — add a dedicated `UserAlreadyExistsException` → 409, following
the pattern already established for `WorkspaceAccessDeniedException`
(403).

---

## New Issues discovered this pass

Covered above as Outstanding #2 (self-service profile edit) and #1
(billing authorization) — both found while implementing the Profile and
Subscription frontend work this session, not carried over from a prior
audit.
