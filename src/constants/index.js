export const COLORS = {
  primary: "#1F6F68",
  secondary: "#2F80ED",
  accent: "#D97706",
  success: "#2F855A",
  warning: "#C2410C",
  danger: "#DC2626",
  light: "#F5F7F6",
  surface: "#FFFFFF",
  surfaceAlt: "#EAF3F1",
  dark: "#1F2933",
  gray: "#718096",
  white: "#FFFFFF",
  black: "#000000",
};

export const CATEGORY_COLORS = {
  Makanan: "#FF6B6B",
  Transport: "#4ECDC4",
  Utilitas: "#FFD93D",
  Hiburan: "#A8E6CF",
  Cicilan: "#FF8B94",
  Belanja: "#FFB6B9",
  Kesehatan: "#95E1D3",
  Lainnya: "#C5B9E8",
};

export const CATEGORY_ICONS = {
  Makanan: "🍔",
  Transport: "🚗",
  Utilitas: "💡",
  Hiburan: "🎬",
  Cicilan: "💳",
  Belanja: "🛍️",
  Kesehatan: "🏥",
  Lainnya: "📦",
};

export const CATEGORIES = ["Makanan", "Transport", "Utilitas", "Hiburan", "Cicilan", "Belanja", "Kesehatan", "Lainnya"];

export const EXPENSE_TYPES = [
  { id: 1, name: "Harian", days: 1 },
  { id: 2, name: "Mingguan", days: 7 },
  { id: 3, name: "Bulanan", days: 30 },
  { id: 4, name: "Tahunan", days: 365 },
];

export const SAVINGS_PERIODS = [
  { id: 1, name: "1 Bulan", months: 1 },
  { id: 2, name: "3 Bulan", months: 3 },
  { id: 3, name: "6 Bulan", months: 6 },
  { id: 4, name: "1 Tahun", months: 12 },
  { id: 5, name: "2 Tahun", months: 24 },
  { id: 6, name: "5 Tahun", months: 60 },
];

export const ALLOCATION_THRESHOLDS = {
  essential: { min: 40, max: 70 },
  savings: { min: 10, max: 40 },
  discretionary: { min: 5, max: 40 },
};
