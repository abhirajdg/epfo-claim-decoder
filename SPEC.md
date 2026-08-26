# EPFO Claim Decoder — build spec

Prototype for Build What Moves India. Problem: EPFO rejects PF claims with a cryptic one-line reason and gives the citizen no next step. This decodes the rejection, tells them exactly what to do and who owns the next action, and lets them resubmit where that's actually possible.

All data in `data/*.json` is mock. No real EPFO system, API, or citizen data is touched anywhere in this build. Every screen that shows this should carry a visible "Demo data — not connected to EPFO" label.

## Data files
- `data/users.json` — 6 mock citizens, each with one active claim. Login is UAN + fixed OTP `000000`.
- `data/claims.json` — one claim per user, rejection code, status history, and `onFixAction`.
- `data/rejection-codes.json` — decoder table with raw text, plain language, actor, ordered fix steps, and turnaround.
- `data/nudge-templates.json` — employer-nudge messages keyed by rejection code.

## Journey
1. Login — default UAN `100234569934`, OTP `000000`.
2. Dashboard — map `rejected` to "Action needed" and show claim type + amount.
3. Decoder — show `plainLanguage` prominently and `rawPortalText` secondary.
4. Fix flow — checklist; self claims get mock correction + resubmit, employer claims show waiting state + copyable nudge.
5. Resubmit — client-side transition per `onFixAction.resultingStatus`, with `typicalTurnaround`.
6. Status tracker — timeline from `statusHistory` plus the current post-fix state.

Prioritize CLM-1001 and CLM-1003 end-to-end. Real auth, EPFO integration, payments, employer portal, and admin views are out of scope.