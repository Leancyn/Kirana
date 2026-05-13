import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency } from "../utils/formatters";
import { COLORS } from "../constants";
import { AppModal, Card, ScreenHeader, SectionHeader, PrimaryButton, SecondaryButton, EmptyState, AllocationBar, MoneyMeter, StatusPill } from "../components";
import { FormInput, CurrencyInput } from "../components/FormComponents";

const SavingsScreen = ({ navigation }) => {
  const { monthlyIncome, savingsTargets, addSavingsTarget, updateSavingsTarget, deleteSavingsTarget, currentMonthSavings, addSaving } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showSavingForm, setShowSavingForm] = useState(false);
  const [targetName, setTargetName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDeadline, setTargetDeadline] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [savingDescription, setSavingDescription] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState({ visible: false });

  const validateTargetForm = () => {
    const errors = {};
    if (!targetName.trim()) errors.targetName = "Nama target harus diisi";
    if (!targetAmount || parseFloat(targetAmount) === 0) errors.targetAmount = "Nominal harus diisi";
    if (!targetDeadline) errors.targetDeadline = "Jangka waktu harus diisi";
    return errors;
  };

  const validateSavingForm = () => {
    const errors = {};
    if (!savingAmount || parseFloat(savingAmount) === 0) errors.savingAmount = "Nominal harus diisi";
    if (!savingDescription.trim()) errors.savingDescription = "Deskripsi harus diisi";
    return errors;
  };

  const handleAddTarget = () => {
    const errors = validateTargetForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addSavingsTarget({
      name: targetName,
      targetAmount: parseFloat(targetAmount),
      deadline: targetDeadline,
      currentAmount: 0,
      status: "active",
      createdDate: new Date(),
    });

    setTargetName("");
    setTargetAmount("");
    setTargetDeadline("");
    setFormErrors({});
    setShowAddForm(false);

    setModal({
      visible: true,
      tone: "success",
      iconName: "flag-outline",
      title: "Target Dibuat",
      message: "Target tabungan baru sudah masuk ke daftar progres.",
    });
  };

  const handleAddSaving = () => {
    const errors = validateSavingForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addSaving(parseFloat(savingAmount), savingDescription);

    if (selectedTargetId) {
      const target = savingsTargets.find((t) => t.id === selectedTargetId);
      if (target) {
        updateSavingsTarget(selectedTargetId, {
          currentAmount: (target.currentAmount || 0) + parseFloat(savingAmount),
        });
      }
    }

    setSavingAmount("");
    setSavingDescription("");
    setFormErrors({});
    setShowSavingForm(false);
    setSelectedTargetId(null);

    setModal({
      visible: true,
      tone: "success",
      iconName: "wallet-outline",
      title: "Tabungan Tercatat",
      message: selectedTargetId ? "Nominal tabungan sudah ditambahkan ke target pilihan." : "Nominal tabungan sudah masuk ke catatan bulan ini.",
    });
  };

  const handleDeleteTarget = (id) => {
    setModal({
      visible: true,
      tone: "danger",
      iconName: "trash-outline",
      title: "Hapus Target?",
      message: "Target tabungan dan progresnya akan dihapus dari daftar.",
      primaryLabel: "Hapus",
      secondaryLabel: "Batal",
      onPrimaryPress: () => {
        deleteSavingsTarget(id);
        setModal({ visible: false });
      },
    });
  };

  const totalSavingsTarget = savingsTargets.reduce((sum, t) => sum + (t.targetAmount || 0), 0);
  const totalCurrentSavings = savingsTargets.reduce((sum, t) => sum + (t.currentAmount || 0), 0);
  const targetProgress = totalSavingsTarget > 0 ? (totalCurrentSavings / totalSavingsTarget) * 100 : 0;
  const selectedTarget = savingsTargets.find((target) => target.id === selectedTargetId);

  if (monthlyIncome === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <EmptyState iconName="settings-outline" title="Setup Profil Terlebih Dahulu" subtitle="Lengkapi informasi keuangan Anda untuk mulai merencanakan tabungan" />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Tujuan finansial" title="Tabungan" subtitle="Pantau progres target dan catat uang yang berhasil disisihkan." iconName="wallet-outline" color={COLORS.success} />

        {!showAddForm && !showSavingForm && (
          <Card style={styles.savingActionCard}>
            <View style={styles.savingActionHeader}>
              <View style={styles.savingActionIcon}>
                <Ionicons name="leaf-outline" size={22} color={COLORS.success} />
              </View>
              <View style={styles.savingActionText}>
                <Text style={styles.savingActionTitle}>Sisihkan uang hari ini</Text>
                <Text style={styles.savingActionSubtitle}>Catat tabungan kecil atau buat target baru dengan jelas.</Text>
              </View>
            </View>
            <View style={styles.savingActionButtons}>
              <PrimaryButton title="Catat Tabungan" iconName="add-circle-outline" onPress={() => setShowSavingForm(true)} style={{ flex: 1 }} />
              <SecondaryButton title="Target Baru" iconName="flag-outline" onPress={() => setShowAddForm(true)} style={{ flex: 1 }} />
            </View>
          </Card>
        )}

        {/* Overview */}
        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View style={styles.overviewCopy}>
              <Text style={styles.overviewLabel}>Target Tabungan Total</Text>
              <Text style={styles.overviewValue}>{formatCurrency(totalSavingsTarget)}</Text>
              <Text style={styles.overviewSubtitle}>{formatCurrency(totalCurrentSavings)} sudah terkumpul</Text>
            </View>
            <StatusPill label={`${Math.min(targetProgress, 100).toFixed(0)}%`} iconName="trending-up" color={COLORS.success} style={styles.overviewPill} />
          </View>
          <MoneyMeter label="Progress semua target" value={totalCurrentSavings} limit={totalSavingsTarget} color={COLORS.success} helper={totalSavingsTarget > 0 ? `${formatCurrency(Math.max(0, totalSavingsTarget - totalCurrentSavings))} lagi menuju target` : "Buat target pertama untuk mulai memantau progres"} inverse />
        </Card>

        {/* Monthly Savings Overview */}
        <Card style={styles.monthlyCard}>
          <Text style={styles.monthlyLabel}>Tabungan Bulan Ini</Text>
          <Text style={styles.monthlyValue}>{formatCurrency(currentMonthSavings)}</Text>
        </Card>

        {/* Forms */}
        {showSavingForm && (
          <>
            <SectionHeader title="Catat Tabungan" />
            <Card style={styles.formCard}>
              {selectedTarget && (
                <View style={styles.selectedTargetBox}>
                  <Ionicons name="flag-outline" size={18} color={COLORS.success} />
                  <Text style={styles.selectedTargetText}>Masuk ke target: {selectedTarget.name}</Text>
                </View>
              )}

              <CurrencyInput label="Nominal Tabungan" value={savingAmount} onChangeText={setSavingAmount} error={formErrors.savingAmount} />

              <FormInput label="Deskripsi" placeholder="Contoh: Tabungan dari gaji" value={savingDescription} onChangeText={setSavingDescription} error={formErrors.savingDescription} />

              <View style={styles.formActions}>
                <SecondaryButton
                  title="Batal"
                  onPress={() => {
                    setShowSavingForm(false);
                    setFormErrors({});
                  }}
                  style={{ flex: 1 }}
                />
                <PrimaryButton title="Simpan" iconName="checkmark-outline" onPress={handleAddSaving} style={{ flex: 1, marginLeft: 10 }} />
              </View>
            </Card>
          </>
        )}

        {showAddForm && (
          <>
            <SectionHeader title="Buat Target Tabungan" />
            <Card style={styles.formCard}>
              <FormInput label="Nama Target" placeholder="Contoh: Liburan ke Bali" value={targetName} onChangeText={setTargetName} error={formErrors.targetName} />

              <CurrencyInput label="Target Jumlah" value={targetAmount} onChangeText={setTargetAmount} error={formErrors.targetAmount} />

              <FormInput label="Jangka Waktu (bulan)" placeholder="Contoh: 12" value={targetDeadline} onChangeText={setTargetDeadline} keyboardType="number-pad" error={formErrors.targetDeadline} />

              <View style={styles.formActions}>
                <SecondaryButton
                  title="Batal"
                  onPress={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  style={{ flex: 1 }}
                />
                <PrimaryButton title="Buat Target" iconName="flag-outline" onPress={handleAddTarget} style={{ flex: 1, marginLeft: 10 }} />
              </View>
            </Card>
          </>
        )}

        {/* Targets List */}
        {savingsTargets.length > 0 && (
          <>
            <SectionHeader title="Target Tabungan" subtitle={`${savingsTargets.length} target aktif`} />
            {savingsTargets.map((target) => {
              const progress = target.targetAmount > 0 ? (target.currentAmount / target.targetAmount) * 100 : 0;
              const isCompleted = target.currentAmount >= target.targetAmount;

              return (
                <Card key={target.id} style={[styles.targetCard, isCompleted && { backgroundColor: "#F0FDF4" }]} onPress={() => navigation.navigate("SavingsDetail", { savingsId: target.id })}>
                  <View style={styles.targetHeader}>
                    <View style={styles.targetInfo}>
                      <Text style={styles.targetName}>{target.name}</Text>
                      <Text style={styles.targetDeadline}>
                        {target.deadline} bulan · Target {formatCurrency(target.targetAmount)}
                      </Text>
                    </View>
                    {isCompleted ? <StatusPill label="Tercapai" iconName="checkmark-circle" color={COLORS.success} /> : <StatusPill label="Aktif" iconName="time-outline" color={COLORS.primary} />}
                  </View>

                  <AllocationBar label="Progres" percentage={Math.min(progress, 100)} color={isCompleted ? COLORS.success : COLORS.primary} amount={formatCurrency(target.currentAmount)} />

                  <View style={styles.targetActions}>
                    <SecondaryButton
                      title="+ Tambah Tabungan"
                      onPress={() => {
                        setSelectedTargetId(target.id);
                        setShowSavingForm(true);
                      }}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <SecondaryButton title="Hapus" onPress={() => handleDeleteTarget(target.id)} style={{ flex: 0, paddingHorizontal: 12 }} />
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {!showAddForm && !showSavingForm && savingsTargets.length === 0 && <EmptyState iconName="flag-outline" title="Belum Ada Target Tabungan" subtitle="Buat target tabungan untuk mencapai impian Anda" />}

        <View style={styles.spacing} />
      </ScrollView>

      {/* Action Buttons */}
      {!showAddForm && !showSavingForm && (
        <View style={styles.actionButtons}>
          <SecondaryButton title="Target Baru" iconName="flag-outline" onPress={() => setShowAddForm(true)} style={{ flex: 1, marginRight: 8 }} />
          <PrimaryButton title="Catat Tabungan" iconName="add-circle-outline" onPress={() => setShowSavingForm(true)} style={{ flex: 1 }} />
        </View>
      )}

      <AppModal
        visible={modal.visible}
        tone={modal.tone}
        iconName={modal.iconName}
        title={modal.title}
        message={modal.message}
        primaryLabel={modal.primaryLabel || "Mengerti"}
        secondaryLabel={modal.secondaryLabel}
        onPrimaryPress={modal.onPrimaryPress || (() => setModal({ visible: false }))}
        onSecondaryPress={() => setModal({ visible: false })}
        onClose={() => setModal({ visible: false })}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 168,
  },
  savingActionCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDE8E5",
  },
  savingActionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  savingActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EAF3F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  savingActionText: {
    flex: 1,
  },
  savingActionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.dark,
    marginBottom: 3,
  },
  savingActionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 17,
  },
  savingActionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  overviewCard: {
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  overviewCopy: {
    flex: 1,
  },
  overviewPill: {
    backgroundColor: COLORS.white,
  },
  overviewLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
  },
  overviewValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  overviewSubtitle: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 12,
  },
  monthlyCard: {
    backgroundColor: COLORS.success,
    marginBottom: 16,
  },
  monthlyLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  monthlyValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  formCard: {
    marginBottom: 20,
  },
  selectedTargetBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  selectedTargetText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: "600",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  targetCard: {
    marginBottom: 12,
  },
  targetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 2,
  },
  targetDeadline: {
    fontSize: 12,
    color: COLORS.gray,
  },
  targetActions: {
    flexDirection: "row",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 104,
    gap: 12,
    backgroundColor: "transparent",
  },
  spacing: {
    height: 20,
  },
});

export default SavingsScreen;
