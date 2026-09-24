// Status colours are hex on purpose: consumers append an alpha suffix (`${color}22`)
// to build tinted backgrounds, which does not work with var(). Keep in sync with the
// palette in Style.css: blue = --fidmap-blue, green = --fm-success, red = --fm-danger, grey = --fm-muted
// (violet and amber are used for statuses only).
export const FEEDBACK_STATUS = {
  OPEN: { label: "Open", color: "#64748b" },
  PLANNED: { label: "Planned", color: "#7c3aed" },
  IN_PROGRESS: { label: "In progress", color: "#2563eb" },
  COMPLETED: { label: "Completed", color: "#15803d" },
  REJECTED: { label: "Rejected", color: "#dc2626" },
};

export const ROADMAP_STATUS = {
  CONSIDERING: { label: "Considering", color: "#64748b" },
  PLANNED: { label: "Planned", color: "#7c3aed" },
  IN_PROGRESS: { label: "In progress", color: "#2563eb" },
  TESTING: { label: "Testing", color: "#b45309" },
  COMPLETE: { label: "Complete", color: "#15803d" },
  CANCELLED: { label: "Cancelled", color: "#dc2626" },
};
