/**
 * Fuzzy Tsukamoto Engine for Spending Recommendation
 *
 * Input Variables:
 * - monthlyIncome: Total bulanan pendapatan
 * - totalExpenses: Total pengeluaran saat ini
 * - savingsTarget: Target tabungan yang diinginkan
 *
 * Output Variables:
 * - essentialAllocation: % untuk kebutuhan esensial (makanan, transport, dll)
 * - savingsAllocation: % untuk tabungan
 * - discretionaryAllocation: % untuk pengeluaran diskresioner
 */

// Membership Functions
export const membershipFunctions = {
  // Untuk Income
  incomeLow: (x, a = 1000000, b = 3000000) => {
    if (x <= a) return 1;
    if (x >= b) return 0;
    return (b - x) / (b - a);
  },

  incomeMedium: (x, a = 1000000, b = 3000000, c = 7000000) => {
    if (x <= a || x >= c) return 0;
    if (x <= b) return (x - a) / (b - a);
    return (c - x) / (c - b);
  },

  incomeHigh: (x, a = 3000000, b = 7000000) => {
    if (x <= a) return 0;
    if (x >= b) return 1;
    return (x - a) / (b - a);
  },

  // Untuk Expense Ratio (total expenses / income)
  expenseRatioLow: (ratio) => {
    if (ratio <= 0.3) return 1;
    if (ratio >= 0.6) return 0;
    return (0.6 - ratio) / 0.3;
  },

  expenseRatioMedium: (ratio) => {
    if (ratio <= 0.3 || ratio >= 0.8) return 0;
    if (ratio <= 0.6) return (ratio - 0.3) / 0.3;
    return (0.8 - ratio) / 0.2;
  },

  expenseRatioHigh: (ratio) => {
    if (ratio <= 0.6) return 0;
    if (ratio >= 0.8) return 1;
    return (ratio - 0.6) / 0.2;
  },

  // Untuk Savings Target Ratio (target / income)
  savingsTargetLow: (ratio) => {
    if (ratio <= 0.05) return 1;
    if (ratio >= 0.2) return 0;
    return (0.2 - ratio) / 0.15;
  },

  savingsTargetMedium: (ratio) => {
    if (ratio <= 0.05 || ratio >= 0.35) return 0;
    if (ratio <= 0.2) return (ratio - 0.05) / 0.15;
    return (0.35 - ratio) / 0.15;
  },

  savingsTargetHigh: (ratio) => {
    if (ratio <= 0.2) return 0;
    if (ratio >= 0.35) return 1;
    return (ratio - 0.2) / 0.15;
  },
};

// Output Membership Functions (Tsukamoto)
export const outputMembershipFunctions = {
  allocLow: (x) => {
    if (x <= 30) return 1;
    if (x >= 50) return 0;
    return (50 - x) / 20;
  },

  allocMedium: (x) => {
    if (x <= 30 || x >= 70) return 0;
    if (x <= 50) return (x - 30) / 20;
    return (70 - x) / 20;
  },

  allocHigh: (x) => {
    if (x <= 50) return 0;
    if (x >= 70) return 1;
    return (x - 50) / 20;
  },

  // Inverse function untuk Tsukamoto (mencari z dari membership degree w)
  allocLowInverse: (w) => {
    if (w === 0) return 50;
    return 50 - w * 20;
  },

  allocMediumInverse: (w) => {
    return 50; // Peak dari membership function medium
  },

  allocHighInverse: (w) => {
    if (w === 0) return 50;
    return 50 + w * 20;
  },
};

/**
 * Inference Engine
 * Fuzzy Rules untuk rekomendasi alokasi
 */
export const fuzzyInference = (monthlyIncome, totalExpenses, savingsTarget) => {
  if (!monthlyIncome || monthlyIncome <= 0) {
    return {
      essential: 60,
      savings: 20,
      discretionary: 20,
      confidence: 0,
    };
  }

  // Normalized inputs
  const expenseRatio = totalExpenses / monthlyIncome;
  const savingsRatio = savingsTarget / monthlyIncome;

  // Fuzzification - hitung membership degree
  const incomeMembership = {
    low: membershipFunctions.incomeLow(monthlyIncome),
    medium: membershipFunctions.incomeMedium(monthlyIncome),
    high: membershipFunctions.incomeHigh(monthlyIncome),
  };

  const expenseMembership = {
    low: membershipFunctions.expenseRatioLow(expenseRatio),
    medium: membershipFunctions.expenseRatioMedium(expenseRatio),
    high: membershipFunctions.expenseRatioHigh(expenseRatio),
  };

  const savingsMembership = {
    low: membershipFunctions.savingsTargetLow(savingsRatio),
    medium: membershipFunctions.savingsTargetMedium(savingsRatio),
    high: membershipFunctions.savingsTargetHigh(savingsRatio),
  };

  // Rule Base
  const rules = [
    // Rule 1: If Income=Low AND ExpenseRatio=High THEN Essential=High, Savings=Low, Discretionary=Low
    {
      antecedent: Math.min(incomeMembership.low, expenseMembership.high),
      consequence: {
        essential: "high",
        savings: "low",
        discretionary: "low",
      },
    },
    // Rule 2: If Income=Medium AND ExpenseRatio=Medium THEN Essential=Medium, Savings=Medium, Discretionary=Medium
    {
      antecedent: Math.min(incomeMembership.medium, expenseMembership.medium),
      consequence: {
        essential: "medium",
        savings: "medium",
        discretionary: "medium",
      },
    },
    // Rule 3: If Income=High AND SavingsTarget=High THEN Essential=Medium, Savings=High, Discretionary=Medium
    {
      antecedent: Math.min(incomeMembership.high, savingsMembership.high),
      consequence: {
        essential: "medium",
        savings: "high",
        discretionary: "medium",
      },
    },
    // Rule 4: If ExpenseRatio=Low AND SavingsTarget=Medium THEN Essential=Low, Savings=High, Discretionary=High
    {
      antecedent: Math.min(expenseMembership.low, savingsMembership.medium),
      consequence: {
        essential: "low",
        savings: "high",
        discretionary: "high",
      },
    },
    // Rule 5: If Income=Medium AND ExpenseRatio=High THEN Essential=High, Savings=Medium, Discretionary=Low
    {
      antecedent: Math.min(incomeMembership.medium, expenseMembership.high),
      consequence: {
        essential: "high",
        savings: "medium",
        discretionary: "low",
      },
    },
    // Rule 6: If Income=Low AND SavingsTarget=Medium THEN Essential=Medium, Savings=Medium, Discretionary=Low
    {
      antecedent: Math.min(incomeMembership.low, savingsMembership.medium),
      consequence: {
        essential: "medium",
        savings: "medium",
        discretionary: "low",
      },
    },
    // Rule 7: If ExpenseRatio=Low AND Income=High THEN Essential=Medium, Savings=Medium, Discretionary=High
    {
      antecedent: Math.min(expenseMembership.low, incomeMembership.high),
      consequence: {
        essential: "medium",
        savings: "medium",
        discretionary: "high",
      },
    },
  ];

  // Aggregate rules untuk tiap output
  const aggregateOutput = (outputType) => {
    let numerator = 0;
    let denominator = 0;

    rules.forEach((rule) => {
      const w = rule.antecedent;
      const consequence = rule.consequence[outputType];

      if (consequence === "low") {
        const z = outputMembershipFunctions.allocLowInverse(w);
        numerator += w * z;
      } else if (consequence === "medium") {
        const z = outputMembershipFunctions.allocMediumInverse(w);
        numerator += w * z;
      } else if (consequence === "high") {
        const z = outputMembershipFunctions.allocHighInverse(w);
        numerator += w * z;
      }

      denominator += w;
    });

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Defuzzification - hitung output crisp values
  const essentialAllocation = aggregateOutput("essential");
  const savingsAllocation = aggregateOutput("savings");
  const discretionaryAllocation = aggregateOutput("discretionary");

  // Normalisasi agar total = 100%
  const total = essentialAllocation + savingsAllocation + discretionaryAllocation;
  if (!total) {
    return {
      essential: 60,
      savings: 20,
      discretionary: 20,
      confidence: 0,
    };
  }

  const normalizedEssential = (essentialAllocation / total) * 100;
  const normalizedSavings = (savingsAllocation / total) * 100;
  const normalizedDiscretionary = (discretionaryAllocation / total) * 100;

  return {
    essential: Math.round(normalizedEssential),
    savings: Math.round(normalizedSavings),
    discretionary: Math.round(normalizedDiscretionary),
    // Use average confidence instead of minimum for more accurate representation
    confidence: rules.length > 0 ? rules.reduce((sum, r) => sum + r.antecedent, 0) / rules.length : 0,
  };
};

/**
 * Generate detailed recommendations based on fuzzy output
 */
export const generateRecommendations = (monthlyIncome, totalExpenses, savingsTarget, allocation) => {
  const recommendedEssentialAmount = (monthlyIncome * allocation.essential) / 100;
  const recommendedSavingsAmount = (monthlyIncome * allocation.savings) / 100;
  const recommendedDiscretionaryAmount = (monthlyIncome * allocation.discretionary) / 100;

  const currentExpenseRatio = (totalExpenses / monthlyIncome) * 100;
  // Check if spending is within recommended allocation (essential + discretionary can flex up to 100% - savings)
  const isSpendingOptimal = currentExpenseRatio <= 100 && currentExpenseRatio <= allocation.essential + allocation.discretionary;

  return {
    allocations: {
      essential: {
        percentage: allocation.essential,
        amount: Math.round(recommendedEssentialAmount),
        description: "Kebutuhan pokok: makanan, transport, utilitas, cicilan",
      },
      savings: {
        percentage: allocation.savings,
        amount: Math.round(recommendedSavingsAmount),
        description: "Dana tabungan untuk tujuan jangka pendek & panjang",
      },
      discretionary: {
        percentage: allocation.discretionary,
        amount: Math.round(recommendedDiscretionaryAmount),
        description: "Pengeluaran optional: hiburan, hobi, lifestyle",
      },
    },
    summary: {
      isOptimal: isSpendingOptimal,
      message: isSpendingOptimal ? "Pengeluaran Anda sudah baik! Lanjutkan dan tingkatkan tabungan." : "Pengeluaran Anda melebihi rekomendasi. Kurangi pengeluaran diskresioner.",
      spendingStatus: currentExpenseRatio > 100 ? "OVERSPEND" : "BALANCED",
      savingsGap: Math.max(0, recommendedSavingsAmount - savingsTarget),
    },
    actionItems: [
      isSpendingOptimal ? "Pertahankan pola pengeluaran yang sehat" : "Identifikasi dan kurangi pengeluaran yang tidak perlu",
      `Targetkan tabungan sebesar Rp ${Math.round(recommendedSavingsAmount).toLocaleString("id-ID")} per bulan`,
      `Alokasikan Rp ${Math.round(recommendedEssentialAmount).toLocaleString("id-ID")} untuk kebutuhan pokok`,
    ],
  };
};
