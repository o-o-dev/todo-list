export const CATEGORY_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number]["value"];

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[5].value; // Blue
