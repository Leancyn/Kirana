import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { AllocationBar, Card, EmptyState, MoneyMeter, ScreenHeader, SectionHeader, StatusPill } from "../components";

import { COLORS } from "../constants";
import { fuzzyInference, generateRecommendations } from "../fuzzy/tsukamoto";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency } from "../utils/formatters";

import { Ionicons } from "@expo/vector-icons";

const RecommendationScreen = () => {
  const { monthlyIncome, accumulatedBalance, currentMonthExpenses, currentMonthSavings, savingsTargets } = useFinanceStore();

  const [recommendation, setRecommendation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const generateRecommendation = useCallback(() => {
    if (monthlyIncome === 0) return;

    // Ikuti logika yang dipakai Dashboard: masukkan saldo terbawa ke total budget
    const totalBudget = monthlyIncome + accumulatedBalance;
    const totalSavingsTarget = savingsTargets.reduce((sum, t) => sum + (t.targetAmount || 0), 0);
    const effectiveSavingsTarget = totalSavingsTarget || currentMonthSavings;

    // fuzzy Tsukamoto (memastikan logika fuzzy tetap dipakai)
    const allocation = fuzzyInference(totalBudget, currentMonthExpenses, effectiveSavingsTarget);
    const rec = generateRecommendations(totalBudget, currentMonthExpenses, effectiveSavingsTarget, allocation);

    setRecommendation(rec);
  }, [accumulatedBalance, currentMonthExpenses, currentMonthSavings, monthlyIncome, savingsTargets]);

  useFocusEffect(generateRecommendation);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateRecommendation();
      setRefreshing(false);
    }, 500);
  };

  if (monthlyIncome === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <EmptyState iconName="settings-outline" title="Setup Profil Terlebih Dahulu" subtitle="Lengkapi informasi keuangan Anda untuk mendapatkan rekomendasi yang akurat" />
      </ScrollView>
    );
  }

  if (!recommendation) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <EmptyState iconName="hourglass-outline" title="Memproses..." subtitle="Analisis data Anda sedang berlangsung" />
      </ScrollView>
    );
  }

  const isBudgetStable = monthlyIncome + accumulatedBalance - currentMonthExpenses - currentMonthSavings >= 0;
  const statusColor = recommendation.summary.isOptimal && isBudgetStable ? COLORS.success : COLORS.warning;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <ScreenHeader eyebrow="Insight" title="Rekomendasi" subtitle="Saran alokasi yang membaca kondisi keuangan bulan ini." iconName="bulb-outline" color={COLORS.primary} />

      <Card style={[styles.statusCard, { borderLeftColor: statusColor }]}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIconWrap}>
            <Ionicons name={recommendation.summary.isOptimal ? "checkmark-circle" : "alert-circle"} size={30} color={statusColor} />
          </View>
          <View style={styles.statusCopy}>
            <StatusPill label={recommendation.summary.isOptimal && isBudgetStable ? "Status Optimal" : "Perlu Penyesuaian"} iconName={recommendation.summary.isOptimal && isBudgetStable ? "checkmark" : "alert"} color={statusColor} />
            <Text style={styles.statusTitle}>{recommendation.summary.isOptimal && isBudgetStable ? "Keuangan stabil" : "Perlu penyesuaian"}</Text>
            <Text style={styles.statusHint}>
              {recommendation.summary.isOptimal && isBudgetStable ? "Pertahankan ritme belanja dan sisihkan tabungan secara konsisten." : "Prioritaskan kebutuhan utama dan tahan pengeluaran yang kurang mendesak."}
            </Text>
          </View>
        </View>
        <Text style={styles.statusMessage}>
          {recommendation.summary.isOptimal && isBudgetStable
            ? "Pengeluaran Anda sudah baik! Lanjutkan dan tingkatkan tabungan."
            : "Pengeluaran Anda tidak sesuai dengan kondisi budget bulan ini. Prioritaskan kebutuhan utama dan kurangi pengeluaran yang kurang mendesak."}
        </Text>
        <MoneyMeter
          label="Rasio pengeluaran"
          value={currentMonthExpenses}
          limit={monthlyIncome + accumulatedBalance}
          color={statusColor}
          helper={`${((currentMonthExpenses / (monthlyIncome + accumulatedBalance)) * 100).toFixed(1)}% dari total budget bulan ini`}
        />
      </Card>

      {/* Allocation Recommendations */}
      <SectionHeader title="Rekomendasi Alokasi Bulanan" />

      <Card style={styles.allocCard}>
        <AllocationBar label="Kebutuhan Esensial" percentage={recommendation.allocations.essential.percentage} color={COLORS.primary} amount={formatCurrency(recommendation.allocations.essential.amount)} />
        <View style={styles.allocDescription}>
          <Text style={styles.allocLabel}>{recommendation.allocations.essential.description}</Text>
        </View>
      </Card>

      <Card style={styles.allocCard}>
        <AllocationBar label="Tabungan" percentage={recommendation.allocations.savings.percentage} color={COLORS.success} amount={formatCurrency(recommendation.allocations.savings.amount)} />
        <View style={styles.allocDescription}>
          <Text style={styles.allocLabel}>{recommendation.allocations.savings.description}</Text>
        </View>
      </Card>

      <Card style={styles.allocCard}>
        <AllocationBar label="Pengeluaran Diskresioner" percentage={recommendation.allocations.discretionary.percentage} color={COLORS.warning} amount={formatCurrency(recommendation.allocations.discretionary.amount)} />
        <View style={styles.allocDescription}>
          <Text style={styles.allocLabel}>{recommendation.allocations.discretionary.description}</Text>
        </View>
      </Card>

      {/* Financial Summary */}
      <SectionHeader title="Ringkasan Keuangan" />

      <View style={styles.summaryGrid}>
        <Card style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Pendapatan Bulanan</Text>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{formatCurrency(monthlyIncome)}</Text>
        </Card>
        <Card style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
          <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{formatCurrency(currentMonthExpenses)}</Text>
        </Card>
      </View>

      <View style={styles.summaryGrid}>
        <Card style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Tabungan Tercatat</Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>{formatCurrency(currentMonthSavings)}</Text>
        </Card>
        <Card style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Sisa Anggaran</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color: monthlyIncome - currentMonthExpenses - currentMonthSavings >= 0 ? COLORS.success : COLORS.danger,
              },
            ]}
          >
            {formatCurrency(monthlyIncome - currentMonthExpenses - currentMonthSavings)}
          </Text>
        </Card>
      </View>

      {/* Action Items */}
      <SectionHeader title="Rekomendasi Tindakan" />

      <Card style={styles.actionCard}>
        {recommendation.actionItems.map((item, index) => (
          <View key={index} style={styles.actionItem}>
            <View style={styles.actionNumber}>
              <Ionicons name="checkmark" size={13} color={COLORS.white} />
            </View>
            <Text style={styles.actionText}>{item}</Text>
          </View>
        ))}
      </Card>

      {/* Fuzzy Logic Explanation */}
      <SectionHeader title="Cara Kerja Sistem" />

      <Card style={styles.explainCard}>
        <Text style={styles.explainTitle}>Fuzzy Tsukamoto</Text>
        <Text style={styles.explainText}>Sistem ini menggunakan metode Fuzzy Tsukamoto untuk menganalisis situasi keuangan Anda berdasarkan:</Text>

        <View style={styles.explainList}>
          <Text style={styles.explainItem}>
            <Text style={styles.explainBold}>Pendapatan Bulanan</Text>: Seberapa besar penghasilan Anda
          </Text>
          <Text style={styles.explainItem}>
            <Text style={styles.explainBold}>Rasio Pengeluaran</Text>: Persentase pengeluaran terhadap pendapatan
          </Text>
          <Text style={styles.explainItem}>
            <Text style={styles.explainBold}>Target Tabungan</Text>: Seberapa ambisius tujuan tabungan Anda
          </Text>
        </View>

        <Text style={styles.explainText}>Berdasarkan analisis ini, sistem memberikan rekomendasi alokasi yang optimal untuk membantu Anda mencapai tujuan finansial sambil tetap memenuhi kebutuhan pokok.</Text>
      </Card>

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
  statusCard: {
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  statusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.light,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCopy: {
    flex: 1,
    gap: 8,
    minWidth: 0,
    paddingRight: 2,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.dark,
    lineHeight: 20,
  },
  statusHint: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 17,
  },
  statusMessage: {
    fontSize: 13,
    color: COLORS.dark,
    lineHeight: 18,
  },
  allocCard: {
    marginBottom: 12,
  },
  allocDescription: {
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    marginTop: 12,
    paddingTop: 12,
  },
  allocLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionCard: {
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.dark,
    flex: 1,
    lineHeight: 16,
  },
  explainCard: {
    marginBottom: 20,
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  explainText: {
    fontSize: 12,
    color: COLORS.dark,
    lineHeight: 18,
    marginBottom: 12,
  },
  explainList: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  explainItem: {
    fontSize: 12,
    color: COLORS.dark,
    lineHeight: 18,
    marginBottom: 6,
  },
  explainBold: {
    fontWeight: "bold",
  },
  spacing: {
    height: 4,
  },
});

export default RecommendationScreen;
