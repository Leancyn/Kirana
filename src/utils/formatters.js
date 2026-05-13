// Format currency to IDR
export const formatCurrency = (amount, currency = "IDR") => {
  if (!amount) return `Rp 0`;

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency === "IDR" ? "IDR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

// Format date
export const formatDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format short date
export const formatShortDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
};

// Get month name
export const getMonthName = (monthIndex) => {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return months[monthIndex];
};

// Calculate percentage
export const calculatePercentage = (amount, total) => {
  if (total === 0) return 0;
  return ((amount / total) * 100).toFixed(1);
};

// Get expense trend
export const getExpenseTrend = (currentExpense, previousExpense) => {
  if (previousExpense === 0) {
    return { trend: "flat", percentage: 0 };
  }

  const change = ((currentExpense - previousExpense) / previousExpense) * 100;
  const trend = change > 0 ? "increase" : change < 0 ? "decrease" : "flat";

  return {
    trend,
    percentage: Math.abs(change).toFixed(1),
  };
};

// Get days remaining in month
export const getDaysRemainingInMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - today.getDate();
  return Math.max(0, daysRemaining);
};

// Get current month and year
export const getCurrentMonthYear = () => {
  const today = new Date();
  return {
    month: today.getMonth(),
    year: today.getFullYear(),
    monthName: getMonthName(today.getMonth()),
  };
};

// Calculate daily budget
export const calculateDailyBudget = (monthlyBudget) => {
  return Math.round(monthlyBudget / 30);
};

// Validate currency input
export const validateCurrencyInput = (value) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= 0 ? numValue : null;
};

// Group expenses by category
export const groupExpensesByCategory = (expenses) => {
  const grouped = {};

  expenses.forEach((expense) => {
    if (!grouped[expense.category]) {
      grouped[expense.category] = {
        category: expense.category,
        amount: 0,
        count: 0,
        percentage: 0,
      };
    }
    grouped[expense.category].amount += expense.amount;
    grouped[expense.category].count += 1;
  });

  const total = Object.values(grouped).reduce((sum, cat) => sum + cat.amount, 0);

  Object.keys(grouped).forEach((key) => {
    grouped[key].percentage = (grouped[key].amount / total) * 100;
  });

  return grouped;
};

// Get pie chart data
export const getPieChartData = (groupedExpenses) => {
  const { CATEGORY_COLORS } = require("../constants");

  return Object.values(groupedExpenses)
    .sort((a, b) => b.amount - a.amount)
    .map((item) => ({
      name: item.category,
      value: item.amount,
      color: CATEGORY_COLORS[item.category] || "#999",
      legendFontColor: "#000",
      legendFontSize: 12,
    }));
};

// Calculate savings rate
export const calculateSavingsRate = (savings, income) => {
  if (income === 0) return 0;
  return ((savings / income) * 100).toFixed(1);
};

// Generate expense statistics
export const generateExpenseStats = (expenses) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;
  const highest = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;
  const lowest = expenses.length > 0 ? Math.min(...expenses.map((e) => e.amount)) : 0;

  return {
    total: Math.round(total),
    average: Math.round(average),
    highest: Math.round(highest),
    lowest: Math.round(lowest),
    count: expenses.length,
  };
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
