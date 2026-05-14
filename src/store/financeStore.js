import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "./storage";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getMonthKey = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // Derived helpers (internal)
      getMonthExpenses: (monthKey) => {
        return get()
          .expenses.filter((e) => getMonthKey(e.date) === monthKey)
          .reduce((sum, e) => sum + e.amount, 0);
      },

      getMonthSavings: (monthKey) => {
        return get()
          .transactions.filter((t) => t.type === "saving" && getMonthKey(t.date) === monthKey)
          .reduce((sum, t) => sum + t.amount, 0);
      },

      // Force recompute all derived state based on stored history
      recomputeDerivedState: () => {
        const now = new Date();
        const currentMonthKey = getMonthKey(now);
        const allMonthKeys = new Set();

        // Collect month keys from expenses and saving transactions
        get().expenses.forEach((e) => allMonthKeys.add(getMonthKey(e.date)));
        get().transactions.forEach((t) => {
          if (t.type === "saving") allMonthKeys.add(getMonthKey(t.date));
        });

        // Ensure current month is included
        allMonthKeys.add(currentMonthKey);

        // Current month derived totals
        const currentMonthExpenses = get().getMonthExpenses(currentMonthKey);
        const currentMonthSavings = get().getMonthSavings(currentMonthKey);

        // accumulatedBalance = carry-over sisa dari bulan-bulan sebelumnya.
        // Model saat ini hanya menyimpan histori expenses & saving transaksi, sementara pendapatan dianggap konstan per bulan (monthlyIncome).
        // Jadi, remainder bulan = monthlyIncome - expenses bulan - savings bulan.
        // Note: remainder boleh negatif; UI sudah menangani.
        const currentYM = now.getFullYear() * 12 + now.getMonth();
        let accumulatedBalance = 0;

        Array.from(allMonthKeys).forEach((mk) => {
          const [yStr, mStr] = mk.split("-");
          const y = Number(yStr);
          const mIndex = Number(mStr) - 1;
          const ym = y * 12 + mIndex;

          if (ym < currentYM) {
            const remainder = get().monthlyIncome - get().getMonthExpenses(mk) - get().getMonthSavings(mk);
            accumulatedBalance += remainder;
          }
        });

        set({
          currentMonthExpenses,
          currentMonthSavings,
          accumulatedBalance,
        });
      },

      lastDerivedMonthKey: null,
      syncRollovers: () => {
        const now = new Date();
        const currentMonthKey = getMonthKey(now);
        const last = get().lastDerivedMonthKey;

        if (last === currentMonthKey) return;

        set({ lastDerivedMonthKey: currentMonthKey });
        get().recomputeDerivedState();
      },
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

      // Recalculate current month data (and also sync month rollovers)
      recalculateCurrentMonthData: () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthExpenses = get()
          .expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
          })
          .reduce((sum, e) => sum + e.amount, 0);

        const currentMonthSavings = get()
          .transactions.filter((t) => t.type === "saving" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((sum, t) => sum + t.amount, 0);

        set({
          currentMonthExpenses,
          currentMonthSavings,
        });

        // Also trigger recomputeDerivedState to sync accumulatedBalance
        get().recomputeDerivedState();
      },

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

      // Reset monthly data (clear expenses/savings for current month, recalculate balance)
      resetMonthlyData: () => {
        set((state) => ({
          expenses: [],
          transactions: [],
          savingsTargets: [],
          currentMonthExpenses: 0,
          currentMonthSavings: 0,
          accumulatedBalance: 0,
          lastDerivedMonthKey: null,
        }));

        // Force recompute after state reset
        setTimeout(() => {
          try {
            get().recomputeDerivedState();
          } catch (_e) {
            // ignore; Zustand state may still be settling
          }
        }, 0);
      },
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
      onRehydrateStorage: () => (state) => {
        // After hydration from storage, recompute derived state to ensure accumulatedBalance is accurate
        if (state) {
          setTimeout(() => {
            try {
              useFinanceStore.getState().recomputeDerivedState();
            } catch (_e) {
              // Ignore errors during rehydration
            }
          }, 0);
        }
      },
    },
  ),
);
