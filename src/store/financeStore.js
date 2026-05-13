import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "./storage";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useFinanceStore = create(
  persist(
    (set) => ({
      // User Profile
      monthlyIncome: 0,
      savingsGoal: 0,
      currency: "IDR",

      // Expenses
      expenses: [],
      categories: ["Makanan", "Transport", "Utilitas", "Hiburan", "Cicilan", "Belanja", "Kesehatan", "Lainnya"],

      // Savings Goals
      savingsTargets: [],

      // Transactions History
      transactions: [],

      // Current Month Data
      currentMonthExpenses: 0,
      currentMonthSavings: 0,
      accumulatedBalance: 0,

      // Recommendations
      lastRecommendation: null,

      // Settings
      setIncome: (income) => set({ monthlyIncome: income }),
      setSavingsGoal: (goal) => set({ savingsGoal: goal }),

      // Add expense
      addExpense: (expense) =>
        set((state) => {
          const expenseId = createId();
          return {
            expenses: [...state.expenses, { id: expenseId, ...expense }],
            transactions: [...state.transactions, { id: createId(), referenceId: expenseId, type: "expense", ...expense }],
            currentMonthExpenses: state.currentMonthExpenses + expense.amount,
          };
        }),

      // Add saving
      addSaving: (amount, description) =>
        set((state) => ({
          currentMonthSavings: state.currentMonthSavings + amount,
          transactions: [
            ...state.transactions,
            {
              id: createId(),
              type: "saving",
              amount,
              description,
              date: new Date(),
            },
          ],
        })),

      // Delete expense
      deleteExpense: (id) =>
        set((state) => {
          const expense = state.expenses.find((e) => e.id === id);
          return {
            expenses: state.expenses.filter((e) => e.id !== id),
            transactions: state.transactions.filter((t) => t.referenceId !== id),
            currentMonthExpenses: Math.max(0, state.currentMonthExpenses - (expense?.amount || 0)),
          };
        }),

      // Add savings target
      addSavingsTarget: (target) =>
        set((state) => ({
          savingsTargets: [...state.savingsTargets, { id: createId(), ...target }],
        })),

      // Update savings target
      updateSavingsTarget: (id, updated) =>
        set((state) => ({
          savingsTargets: state.savingsTargets.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        })),

      // Delete savings target
      deleteSavingsTarget: (id) =>
        set((state) => ({
          savingsTargets: state.savingsTargets.filter((t) => t.id !== id),
        })),

      // Store recommendation
      setRecommendation: (recommendation) => set({ lastRecommendation: recommendation }),

      // Get expense by category
      getExpenseByCategory: function () {
        const state = this.getState?.() || useFinanceStore.getState();
        const grouped = {};
        state.expenses.forEach((expense) => {
          if (!grouped[expense.category]) {
            grouped[expense.category] = 0;
          }
          grouped[expense.category] += expense.amount;
        });
        return grouped;
      },

      // Recalculate current month data
      recalculateCurrentMonthData: () =>
        set((state) => {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const currentMonthExpenses = state.expenses
            .filter((expense) => {
              const expenseDate = new Date(expense.date);
              return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);

          const currentMonthSavings = state.transactions.filter((t) => t.type === "saving" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);

          return {
            currentMonthExpenses,
            currentMonthSavings,
          };
        }),

      // Get total expenses
      getTotalExpenses: function () {
        const state = useFinanceStore.getState();
        return state.expenses.reduce((sum, e) => sum + e.amount, 0);
      },

      // Get remaining budget
      getRemainingBudget: function () {
        const state = useFinanceStore.getState();
        return state.monthlyIncome + state.accumulatedBalance - state.currentMonthExpenses - state.currentMonthSavings;
      },

      // Get today's expenses
      getTodayExpenses: function () {
        const state = useFinanceStore.getState();
        const today = new Date();
        const todayString = today.toDateString();
        return state.expenses.filter((expense) => new Date(expense.date).toDateString() === todayString).reduce((sum, e) => sum + e.amount, 0);
      },

      // Reset monthly data and carry forward remaining balance
      resetMonthlyData: () =>
        set((state) => {
          const remainingBudget = state.monthlyIncome + state.accumulatedBalance - state.currentMonthExpenses - state.currentMonthSavings;
          const carryOverBalance = Math.max(0, remainingBudget);

          return {
            expenses: [],
            transactions: [],
            currentMonthExpenses: 0,
            currentMonthSavings: 0,
            accumulatedBalance: carryOverBalance,
            savingsTargets: [],
          };
        }),
    }),
    {
      name: "finance-store",
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({
        monthlyIncome: state.monthlyIncome,
        savingsGoal: state.savingsGoal,
        currency: state.currency,
        expenses: state.expenses,
        savingsTargets: state.savingsTargets,
        transactions: state.transactions,
        currentMonthExpenses: state.currentMonthExpenses,
        currentMonthSavings: state.currentMonthSavings,
        accumulatedBalance: state.accumulatedBalance,
        lastRecommendation: state.lastRecommendation,
      }),
    },
  ),
);
