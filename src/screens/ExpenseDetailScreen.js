import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, EmptyState, SectionHeader } from "../components";

import { CATEGORY_COLORS, COLORS } from "../constants";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency, formatDate } from "../utils/formatters";

const ExpenseDetailScreen = ({ route }) => {
  const { category } = route.params;
  const { expenses } = useFinanceStore();

  const categoryExpenses = expenses.filter((e) => e.category === category);
  const totalAmount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageAmount = categoryExpenses.length > 0 ? totalAmount / categoryExpenses.length : 0;

  const sortedExpenses = [...categoryExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (categoryExpenses.length === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <EmptyState iconName="receipt-outline" title={`Belum ada pengeluaran ${category}`} subtitle="Mulai catat pengeluaran Anda" />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}

      <Card style={[styles.headerCard, { backgroundColor: CATEGORY_COLORS[category] || COLORS.primary }]}>
        <View style={styles.headerContent}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.categoryTotal}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.categorySubtitle}>{categoryExpenses.length} transaksi</Text>
        </View>
      </Card>

      {/* Statistics */}
      <SectionHeader title="Statistik" />

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Rata-rata</Text>
          <Text style={styles.statValue}>{formatCurrency(averageAmount)}</Text>
        </Card>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Jumlah Transaksi</Text>
          <Text style={styles.statValue}>{categoryExpenses.length}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Tertinggi</Text>
          <Text style={styles.statValue}>{formatCurrency(Math.max(...categoryExpenses.map((e) => e.amount)))}</Text>
        </Card>
      </View>

      {/* Transactions List */}
      <SectionHeader title="Riwayat Transaksi" />

      {sortedExpenses.map((expense, index) => (
        <Card key={expense.id} style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <View style={styles.transactionLeft}>
              <Text style={styles.transactionDescription}>{expense.description}</Text>
              <Text style={styles.transactionDate}>{formatDate(expense.date)}</Text>
            </View>
            <Text style={styles.transactionAmount}>{formatCurrency(expense.amount)}</Text>
          </View>
        </Card>
      ))}

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
    paddingBottom: 128,
  },
  headerCard: {
    marginBottom: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  categoryTotal: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  transactionCard: {
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.dark,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.gray,
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.danger,
    marginLeft: 12,
  },
  spacing: {
    height: 4,
  },
});

export default ExpenseDetailScreen;
