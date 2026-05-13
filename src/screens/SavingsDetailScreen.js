import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency } from "../utils/formatters";
import { COLORS } from "../constants";
import { Card, SectionHeader, AllocationBar, EmptyState, StatusPill } from "../components";

const SavingsDetailScreen = ({ route }) => {
  const { savingsId } = route.params;
  const { savingsTargets } = useFinanceStore();

  const savings = savingsTargets.find((s) => s.id === savingsId);

  if (!savings) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <EmptyState iconName="flag-outline" title="Target tidak ditemukan" subtitle="Target tabungan ini mungkin telah dihapus" />
      </ScrollView>
    );
  }

  const progress = (savings.currentAmount / savings.targetAmount) * 100;
  const isCompleted = savings.currentAmount >= savings.targetAmount;
  const remaining = Math.max(0, savings.targetAmount - savings.currentAmount);
  const monthlyNeed = remaining > 0 ? remaining / parseInt(savings.deadline) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: isCompleted ? COLORS.success : COLORS.primary }]}>
        <Text style={styles.headerTitle}>{savings.name}</Text>
        <StatusPill label={isCompleted ? "Target Tercapai" : `${Math.round(progress)}% Tercapai`} iconName={isCompleted ? "checkmark-circle" : "trending-up"} color={isCompleted ? COLORS.success : COLORS.white} style={styles.headerPill} />
      </Card>

      {/* Progress */}
      <SectionHeader title="Progress Tabungan" />

      <Card>
        <AllocationBar label="Progress" percentage={Math.min(progress, 100)} color={isCompleted ? COLORS.success : COLORS.primary} amount={formatCurrency(savings.currentAmount)} />
      </Card>

      {/* Statistics */}
      <SectionHeader title="Detail" />

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Target</Text>
          <Text style={styles.statValue}>{formatCurrency(savings.targetAmount)}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Terkumpul</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{formatCurrency(savings.currentAmount)}</Text>
        </Card>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Sisa</Text>
          <Text style={styles.statValue}>{formatCurrency(remaining)}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statLabel}>Jangka Waktu</Text>
          <Text style={styles.statValue}>{savings.deadline} bulan</Text>
        </Card>
      </View>

      {/* Recommendation */}
      {!isCompleted && (
        <>
          <SectionHeader title="Rekomendasi" />

          <Card style={styles.recommendCard}>
            <Text style={styles.recommendTitle}>Target Bulanan</Text>
            <Text style={styles.recommendValue}>{formatCurrency(monthlyNeed)} / bulan</Text>
            <Text style={styles.recommendSubtitle}>Sisihkan jumlah ini setiap bulan untuk mencapai target tepat waktu</Text>
          </Card>
        </>
      )}

      {/* Timeline */}
      <SectionHeader title="Informasi" />

      <Card>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Dibuat</Text>
          <Text style={styles.infoValue}>{new Date(savings.createdDate).toLocaleDateString("id-ID")}</Text>
        </View>

        <View style={[styles.infoItem, { borderTopWidth: 1, borderTopColor: COLORS.light, marginTop: 12, paddingTop: 12 }]}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, { color: isCompleted ? COLORS.success : COLORS.warning }]}>{isCompleted ? "Tercapai" : "Sedang Berlangsung"}</Text>
        </View>

        {isCompleted && (
          <View style={[styles.infoItem, { borderTopWidth: 1, borderTopColor: COLORS.light, marginTop: 12, paddingTop: 12 }]}>
            <Text style={styles.infoLabel}>Pencapaian</Text>
            <Text style={[styles.infoValue, { color: COLORS.success }]}>
              {formatCurrency(savings.currentAmount)} dari {formatCurrency(savings.targetAmount)}
            </Text>
          </View>
        )}
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
    paddingBottom: 128,
  },
  headerCard: {
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  headerPill: {
    backgroundColor: "rgba(255,255,255,0.18)",
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
    textAlign: "center",
  },
  recommendCard: {
    backgroundColor: "#F0FDF4",
    marginBottom: 20,
  },
  recommendTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },
  recommendValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.success,
    marginBottom: 4,
  },
  recommendSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 16,
  },
  infoItem: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  spacing: {
    height: 4,
  },
});

export default SavingsDetailScreen;
