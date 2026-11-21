# Security Specification — A Little Something for You

## 1. Data Invariants
1. **Immutable Responses**: Once a response document is created at `/responses/{responseId}`, it can NEVER be updated by any client (`allow update: if false`).
2. **One Response Per Invitation ID**: Because `/responses/{responseId}` enforces `responseId == incoming().invitationId` on `create` only, duplicate submissions for the same invitation ID are rejected with `ALREADY_EXISTS`.
3. **Zero Unauthorized Reads**: Unauthenticated visitors (and non-admin signed-in users) can NEVER `get` or `list` `/responses` or `/invitation_opens`. Only verified admins can read private response records.
4. **Strict Key & Size Boundaries**: Every write enforces `keys().hasAll(...)` and `keys().hasOnly(...)`, strict string length bounds, enum allowlists (`YES`/`NO`), regex ID guards, and `request.time` server timestamps.
5. **No Self-Assigned Admin Privileges**: Clients cannot write to `/admins/{adminId}`.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `get` on `/responses/INV-ISHAAC-IRISH-001`.
2. Unauthenticated `list` on `/responses`.
3. Unauthenticated `list` on `/invitation_opens`.
4. Creating `/responses/INV-ISHAAC-IRISH-001` with mismatched `invitationId: "INV-OTHER"`.
5. Creating `/responses/INV-ISHAAC-IRISH-001` with an invalid `answer: "MAYBE"`.
6. Creating `/responses/INV-ISHAAC-IRISH-001` with a shadow field `isVerified: true`.
7. Creating `/responses/INV-ISHAAC-IRISH-001` with a forged client timestamp instead of `request.time`.
8. Updating `/responses/INV-ISHAAC-IRISH-001` from `NO` to `YES` (even as admin).
9. Creating `/responses/bad!id` with non-alphanumeric characters in the path ID.
10. Creating `/responses/INV-ISHAAC-IRISH-001` with a 500-character `creatorName`.
11. Non-admin signed-in user attempting to `get` `/responses/INV-ISHAAC-IRISH-001`.
12. Signed-in user attempting to create `/admins/{theirUid}` with `{ role: "admin" }`.
