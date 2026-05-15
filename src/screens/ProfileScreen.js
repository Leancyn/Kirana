import Constants from "expo-constants";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppModal, BottomSheetFormModal, Card, EmptyState, PrimaryButton, ScreenHeader, SectionHeader, StatusPill } from "../components";
import { CurrencyInput } from "../components/FormComponents";

import { COLORS } from "../constants";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency } from "../utils/formatters";

const ProfileScreen = () => {
  const { monthlyIncome, setIncome, savingsGoal, setSavingsGoal, resetMonthlyData } = useFinanceStore();

  const [editIncome, setEditIncome] = useState(monthlyIncome.toString());
  const [editSavingsGoal, setEditSavingsGoal] = useState(savingsGoal.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState({ visible: false });

  const validateForm = () => {
    const errors = {};

    if (!editIncome || parseFloat(editIncome) === 0) {
      errors.income = "Pendapatan harus diisi";
    }

    return errors;
  };

  const handleSaveProfile = () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIncome(parseFloat(editIncome));
    setSavingsGoal(parseFloat(editSavingsGoal || 0));
    setFormErrors({});
    setIsEditing(false);

    setModal({
      visible: true,
      tone: "success",
      iconName: "checkmark-circle-outline",
      title: "Profil Tersimpan",
      message: "Pendapatan dan target tabungan bulanan sudah diperbarui.",
    });
  };

  const handleResetData = () => {
    setModal({
      visible: true,
      tone: "warning",
      iconName: "refresh-outline",
      title: "Reset Data Bulanan?",
      message: "Pengeluaran, tabungan bulan ini, dan riwayat transaksi akan dikosongkan.",
      primaryLabel: "Reset",
      secondaryLabel: "Batal",
      onPrimaryPress: () => {
        resetMonthlyData();
        setModal({
          visible: true,
          tone: "success",
          iconName: "checkmark-circle-outline",
          title: "Data Direset",
          message: "Data bulanan sudah dikosongkan dan siap dipakai untuk periode baru.",
        });
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Profil keuangan" title="Profil" subtitle="Atur pendapatan sebagai dasar insight dan rekomendasi." iconName="person-circle-outline" color={COLORS.primary} />

        {monthlyIncome > 0 && !isEditing && (
          <>
            <SectionHeader title="Ringkasan Profil" />

            <Card style={styles.profileCard}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Pendapatan Bulanan</Text>
                <Text style={styles.profileValue}>{formatCurrency(monthlyIncome)}</Text>
              </View>

              {savingsGoal > 0 && (
                <View style={[styles.profileItem, { borderTopWidth: 1, borderTopColor: COLORS.light, marginTop: 12, paddingTop: 12 }]}>
                  <Text style={styles.profileLabel}>Target Tabungan Bulanan</Text>
                  <Text style={styles.profileValue}>{formatCurrency(savingsGoal)}</Text>
                </View>
              )}
            </Card>
          </>
        )}

        <BottomSheetFormModal
          visible={isEditing}
          title="Edit Profil Keuangan"
          onClose={() => {
            setIsEditing(false);
            setEditIncome(monthlyIncome.toString());
            setEditSavingsGoal(savingsGoal.toString());
            setFormErrors({});
          }}
          primaryLabel="Simpan"
          secondaryLabel="Batal"
          primaryIconName="checkmark-outline"
          onSecondaryPress={() => {
            setIsEditing(false);
            setEditIncome(monthlyIncome.toString());
            setEditSavingsGoal(savingsGoal.toString());
            setFormErrors({});
          }}
          onPrimaryPress={handleSaveProfile}
        >
          <CurrencyInput label="Pendapatan Bulanan" value={editIncome} onChangeText={setEditIncome} error={formErrors.income} />

          <CurrencyInput label="Target Tabungan Bulanan (Opsional)" value={editSavingsGoal} onChangeText={setEditSavingsGoal} />

          <Text style={styles.formHelp}>Masukkan target tabungan jika Anda memiliki target khusus. Anda juga bisa membuat target tabungan spesifik di halaman Tabungan.</Text>
        </BottomSheetFormModal>

        {!isEditing && monthlyIncome === 0 && (
          <>
            <EmptyState iconName="person-circle-outline" title="Setup Profil Keuangan Anda" subtitle="Lengkapi informasi pendapatan Anda untuk memulai" />

            <PrimaryButton title="Masukkan Pendapatan Bulanan" iconName="cash-outline" onPress={() => setIsEditing(true)} style={{ marginBottom: 20 }} />

            <SectionHeader title="Langkah Pertama" />
            <Card>
              <Text style={styles.setupText}>1. Masukkan pendapatan bulanan Anda untuk memulai tracking keuangan</Text>
              <Text style={styles.setupText}>2. Mulai catat pengeluaran harian Anda di menu Pengeluaran</Text>
              <Text style={styles.setupText}>3. Buat target tabungan untuk mencapai tujuan finansial Anda</Text>
              <Text style={styles.setupText}>4. Lihat rekomendasi dari sistem Fuzzy Tsukamoto di menu Rekomendasi</Text>
            </Card>
          </>
        )}

        {!isEditing && monthlyIncome > 0 && (
          <>
            <SectionHeader title="Pengaturan Profil" />

            <PrimaryButton title="Edit Profil" iconName="create-outline" onPress={() => setIsEditing(true)} style={{ marginBottom: 10 }} />

            <PrimaryButton title="Reset Semua Data & History" iconName="refresh-outline" onPress={handleResetData} style={{ backgroundColor: COLORS.warning }} />
          </>
        )}

        {/* App Information */}
        <SectionHeader title="Tentang Aplikasi" />

        <Card>
          <Text style={styles.appTitle}>Kirana</Text>
          <Text style={styles.appVersion}>Versi {Constants.expoConfig?.version}</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Fitur Utama:</Text>
            <Text style={styles.featureItem}>• Tracking pengeluaran harian</Text>
            <Text style={styles.featureItem}>• Perencanaan tabungan dengan target</Text>
            <Text style={styles.featureItem}>• Rekomendasi alokasi keuangan menggunakan Fuzzy Tsukamoto</Text>
            <Text style={styles.featureItem}>• Analisis pengeluaran berdasarkan kategori</Text>
            <Text style={styles.featureItem}>• Dashboard ringkasan keuangan</Text>
          </View>
        </Card>

        <Card>
          <StatusPill label="Fuzzy Tsukamoto" iconName="bulb-outline" color={COLORS.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.methodTitle}>Metode Fuzzy Tsukamoto</Text>
          <Text style={styles.methodText}>
            Aplikasi ini menggunakan metode Fuzzy Tsukamoto, sebuah sistem logika fuzzy yang menggabungkan logika fuzzy dengan inference system untuk memberikan rekomendasi alokasi keuangan yang optimal berdasarkan situasi finansial Anda.
          </Text>
          <Text style={styles.methodText}>Dengan mempertimbangkan pendapatan, pengeluaran, dan target tabungan Anda, sistem ini dapat memberikan rekomendasi yang disesuaikan dengan kebutuhan unik Anda.</Text>
        </Card>

        <View style={styles.spacing} />
      </ScrollView>

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
    paddingBottom: 128,
  },
  profileCard: {
    marginBottom: 20,
  },
  profileItem: {
    paddingVertical: 8,
  },
  profileLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  formCard: {
    marginBottom: 20,
  },
  formHelp: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 16,
  },
  formActions: {
    marginTop: 20,
  },
  setupText: {
    fontSize: 13,
    color: COLORS.dark,
    marginBottom: 10,
    lineHeight: 18,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 12,
    color: COLORS.dark,
    lineHeight: 18,
    marginBottom: 8,
  },
  spacing: {
    height: 4,
  },
});

export default ProfileScreen;
