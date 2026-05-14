import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { AllocationBar, Card, CategoryBadge, EmptyState, InsightChip, KiranaHeader, MoneyMeter, PrimaryButton, QuickActionCard, SectionHeader, StatCard, StatusPill } from "../components";

import { CATEGORY_COLORS, COLORS } from "../constants";
import { fuzzyInference, generateRecommendations } from "../fuzzy/tsukamoto";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency, getCurrentMonthYear, groupExpensesByCategory } from "../utils/formatters";

const DashboardScreen = ({ navigation }) => {
  const { monthlyIncome, accumulatedBalance, currentMonthExpenses, currentMonthSavings, expenses, savingsTargets, recalculateCurrentMonthData, getTodayExpenses, syncRollovers } = useFinanceStore();

  const [recommendation, setRecommendation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 1);
    const msUntilNextMonth = Math.max(0, nextMonth.getTime() - now.getTime());

    // Sync segera bila user membuka dashboard setelah bulan berubah
    if (now.getMonth() !== currentMonth || now.getFullYear() !== currentYear) {
      syncRollovers();
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
    }

    const timeoutId = setTimeout(() => {
      const tNow = new Date();
      syncRollovers(); // recomputeDerivedState => accumulatedBalance ikut berubah
      setCurrentMonth(tNow.getMonth());
      setCurrentYear(tNow.getFullYear());
    }, msUntilNextMonth);

    return () => clearTimeout(timeoutId);
  }, [currentMonth, currentYear, syncRollovers]);

  // Pastikan derived state (termasuk accumulatedBalance) selalu sinkron saat bulan berganti
  useFocusEffect(
    useCallback(() => {
      recalculateCurrentMonthData();
    }, [recalculateCurrentMonthData]),
  );

  // Also check on screen focus (when user returns to dashboard)
  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      if (now.getMonth() !== currentMonth || now.getFullYear() !== currentYear) {
        recalculateCurrentMonthData();
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
      }
    }, [currentMonth, currentYear, recalculateCurrentMonthData]),
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const generateNewRecommendation = useCallback(() => {
    if (monthlyIncome === 0) return;

    const totalBudget = monthlyIncome + accumulatedBalance;
    const totalSavingsTarget = savingsTargets.reduce((sum, t) => sum + (t.targetAmount || 0), 0);
    const allocation = fuzzyInference(totalBudget, currentMonthExpenses, totalSavingsTarget || currentMonthSavings);

    const rec = generateRecommendations(totalBudget, currentMonthExpenses, totalSavingsTarget || currentMonthSavings, allocation);

    setRecommendation(rec);

    const grouped = groupExpensesByCategory(expenses);
    setCategoryData(grouped);
  }, [accumulatedBalance, currentMonthExpenses, currentMonthSavings, expenses, monthlyIncome, savingsTargets]);

  useFocusEffect(generateNewRecommendation);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateNewRecommendation();
      setRefreshing(false);
    }, 500);
  };

  const remainingBudget = monthlyIncome + accumulatedBalance - currentMonthExpenses - currentMonthSavings;
  const expensePercentage = monthlyIncome + accumulatedBalance > 0 ? (currentMonthExpenses / (monthlyIncome + accumulatedBalance)) * 100 : 0;
  const savingsPercentage = monthlyIncome + accumulatedBalance > 0 ? (currentMonthSavings / (monthlyIncome + accumulatedBalance)) * 100 : 0;
  const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
  const dailyBudget = Math.max(0, Math.floor(remainingBudget / Math.max(daysLeft || 1, 1)));
  const todayExpenses = getTodayExpenses();
  const dailyBudgetRemaining = Math.max(0, dailyBudget - todayExpenses);
  const isDailyBudgetExceeded = todayExpenses > dailyBudget;

  const budgetStatus =
    remainingBudget < 0
      ? { label: "Melebihi anggaran", color: COLORS.danger, icon: "alert-circle" }
      : expensePercentage >= 90
        ? { label: "Sangat Perlu Hemat", color: COLORS.danger, icon: "alert-circle" }
        : expensePercentage > 75
          ? { label: "Perlu hemat", color: COLORS.warning, icon: "trending-up" }
          : expensePercentage > 50
            ? { label: "Cukup baik", color: COLORS.primary, icon: "trending-down" }
            : { label: "Sehat", color: COLORS.success, icon: "checkmark-circle" };

  if (monthlyIncome === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <EmptyState
          iconName="settings-outline"
          title="Setup Profil Terlebih Dahulu"
          subtitle="Lengkapi informasi keuangan Anda untuk mulai mendapatkan rekomendasi yang tepat"
          action="Ke Profil"
          onActionPress={() => navigation.navigate("Profile")}
        />
      </ScrollView>
    );
  }

  const topCategories = Object.values(categoryData)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <KiranaHeader />
      <Animated.View style={[styles.heroCard, { opacity: fadeAnim }]}>
        <View style={styles.heroTopLine}>
          <Text style={styles.monthYear}>
            {getCurrentMonthYear().monthName} {getCurrentMonthYear().year}
          </Text>
          <Text style={styles.heroMood}>Ringkasan bulan ini</Text>
        </View>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>Sisa uang kamu</Text>

            <Text style={[styles.heroValue, { color: remainingBudget >= 0 ? COLORS.white : "#FECACA" }]}>{formatCurrency(remainingBudget)}</Text>
          </View>
          <StatusPill label={budgetStatus.label} iconName={budgetStatus.icon} color={budgetStatus.color} style={styles.heroPill} />
        </View>
        <MoneyMeter label="Pengeluaran bulan ini" value={currentMonthExpenses} limit={monthlyIncome + accumulatedBalance} color={budgetStatus.color} helper={`${expensePercentage.toFixed(1)}% dari total budget sudah terpakai`} inverse />
      </Animated.View>

      <View style={styles.insightRow}>
        <InsightChip label="Sisa budget harian" value={formatCurrency(dailyBudgetRemaining)} iconName="cafe-outline" color={COLORS.secondary} />
        <InsightChip label="Hari tersisa" value={`${daysLeft} hari`} iconName="calendar-outline" color={COLORS.accent} />
      </View>

      {/* Daily Budget Warning */}
      {isDailyBudgetExceeded && (
        <Card style={[styles.warningCard, { backgroundColor: "#FEF2F2", borderLeftWidth: 4, borderLeftColor: COLORS.danger }]}>
          <View style={styles.warningHeader}>
            <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
            <Text style={[styles.warningTitle, { color: COLORS.danger }]}>Budget Harian Terlampaui</Text>
          </View>
          <Text style={styles.warningText}>
            Pengeluaran hari ini sebesar <Text style={{ fontWeight: "bold" }}>{formatCurrency(todayExpenses)}</Text> telah melampaui budget harian Anda sebesar {formatCurrency(dailyBudget)}.
          </Text>
          <Text style={[styles.warningSubtext, { marginTop: 6 }]}>
            Kelebihan: <Text style={{ color: COLORS.danger, fontWeight: "bold" }}>{formatCurrency(todayExpenses - dailyBudget)}</Text>
          </Text>
        </Card>
      )}

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard label="Pendapatan" value={formatCurrency(monthlyIncome)} iconName="cash-outline" color={COLORS.primary} style={styles.statBoxSmall} />
        <Card style={styles.statBoxSmall}>
          <Text style={styles.statBoxLabel}>Pengeluaran</Text>
          <Text style={[styles.statBoxValue, { color: COLORS.danger }]}>{formatCurrency(currentMonthExpenses)}</Text>
          <Text style={styles.statBoxPercentage}>{expensePercentage.toFixed(1)}% dari pendapatan</Text>
        </Card>

        <Card style={styles.statBoxSmall}>
          <Text style={styles.statBoxLabel}>Tabungan</Text>
          <Text style={[styles.statBoxValue, { color: COLORS.success }]}>{formatCurrency(currentMonthSavings)}</Text>
          <Text style={styles.statBoxPercentage}>{savingsPercentage.toFixed(1)}% dari pendapatan</Text>
        </Card>

        {accumulatedBalance > 0 && (
          <Card style={styles.statBoxSmall}>
            <Text style={styles.statBoxLabel}>Saldo Terbawa</Text>
            <Text style={[styles.statBoxValue, { color: COLORS.accent }]}>{formatCurrency(accumulatedBalance)}</Text>
            <Text style={styles.statBoxPercentage}>Dari bulan lalu</Text>
          </Card>
        )}
      </View>

      {/* Allocation Recommendations */}
      {recommendation && (
        <>
          <SectionHeader title="Rencana Bulan Ini" subtitle="Alokasi otomatis dari kondisi keuanganmu" />
          <Card>
            <AllocationBar label="Kebutuhan Esensial" percentage={recommendation.allocations.essential.percentage} color={COLORS.primary} amount={formatCurrency(recommendation.allocations.essential.amount)} />
            <AllocationBar label="Tabungan" percentage={recommendation.allocations.savings.percentage} color={COLORS.success} amount={formatCurrency(recommendation.allocations.savings.amount)} />
            <AllocationBar label="Pengeluaran Diskresioner" percentage={recommendation.allocations.discretionary.percentage} color={COLORS.warning} amount={formatCurrency(recommendation.allocations.discretionary.amount)} />
          </Card>

          {/* Recommendation Message */}
          <Card
            style={[
              styles.recommendationCard,
              {
                backgroundColor: recommendation.summary.isOptimal ? COLORS.light : "#FEF3C7",
              },
            ]}
          >
            <View style={styles.recommendationHeader}>
              <Ionicons name="list-outline" size={24} color={recommendation.summary.isOptimal ? COLORS.success : COLORS.warning} />
              <Text style={styles.recommendationTitle}>Status Pengeluaran</Text>
            </View>
            <Text style={styles.recommendationText}>{recommendation.summary.message}</Text>
            <View style={styles.actionItemsContainer}>
              {recommendation.actionItems.map((item, index) => (
                <View key={index} style={styles.actionItem}>
                  <Ionicons name="checkmark" size={14} color={COLORS.primary} style={styles.actionItemIcon} />
                  <Text style={styles.actionItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </Card>
        </>
      )}

      {/* Top Expense Categories */}
      {topCategories.length > 0 && (
        <>
          <SectionHeader title="Spending Teratas" action="Lihat semua" onActionPress={() => navigation.navigate("AddExpense")} />
          {topCategories.map((category) => (
            <CategoryBadge
              key={category.category}
              category={category.category}
              color={CATEGORY_COLORS[category.category]}
              amount={formatCurrency(category.amount)}
              percentage={category.percentage.toFixed(1)}
              onPress={() => navigation.navigate("ExpenseDetail", { category: category.category })}
            />
          ))}
        </>
      )}

      {/* Quick Action Buttons */}
      <SectionHeader title="Aksi Cepat" />
      <View style={styles.actionButtons}>
        <QuickActionCard title="Catat pengeluaran" subtitle="Masukkan transaksi sebelum lupa" iconName="add-circle-outline" color={COLORS.danger} onPress={() => navigation.navigate("AddExpense")} />
        <QuickActionCard title="Tambah tabungan" subtitle="Isi progres target yang sedang berjalan" iconName="wallet-outline" color={COLORS.success} onPress={() => navigation.navigate("Savings")} />
        <PrimaryButton title="Lihat Insight Lengkap" iconName="bulb-outline" onPress={() => navigation.navigate("Recommendation")} style={styles.actionButtonFull} />
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 128,
  },
  heroCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  heroTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  monthYear: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.72,
  },
  heroMood: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.13)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heroCopy: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.82,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 27,
    fontWeight: "800",
  },
  heroPill: {
    backgroundColor: COLORS.white,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statBoxSmall: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 104,
  },
  statBoxLabel: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statBoxPercentage: {
    fontSize: 11,
    color: COLORS.gray,
  },
  recommendationCard: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  recommendationText: {
    fontSize: 13,
    color: COLORS.dark,
    marginBottom: 12,
    lineHeight: 18,
  },
  actionItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingTop: 12,
  },
  actionItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  actionItemIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  actionItemText: {
    fontSize: 12,
    color: COLORS.dark,
    flex: 1,
    lineHeight: 16,
  },
  actionButtons: {
    marginBottom: 20,
  },
  actionButtonFull: {
    width: "100%",
  },
  insightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  warningCard: {
    marginBottom: 16,
    padding: 14,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 12,
    color: COLORS.dark,
    lineHeight: 16,
  },
  warningSubtext: {
    fontSize: 11,
    color: COLORS.gray,
  },
  spacing: {
    height: 4,
  },
});

export default DashboardScreen;
