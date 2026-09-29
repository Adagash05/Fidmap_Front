// Exact backend enum values (ReferralPayoutStatus) as specified — see
// docs/backend-api-requirements.md #16. Mirrors FEEDBACK_STATUS /
// ROADMAP_STATUS in STATUS.jsx: hex colours so `${color}22` tinted
// backgrounds work.
export const PAYOUT_STATUS = {
  PENDING: { label: "Pending", color: "#b45309" },
  PAID: { label: "Paid", color: "#15803d" },
  REVERSED: { label: "Reversed", color: "#dc2626" },
};
