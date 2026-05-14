import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppModal, BottomSheetFormModal, Card, CategoryBadge, EmptyState, MoneyMeter, PrimaryButton, ScreenHeader, SectionHeader, StatusPill } from "../components";

import { CategorySelector, CurrencyInput, DateTimePicker, FormInput } from "../components/FormComponents";

import { CATEGORIES, COLORS } from "../constants";
import { useFinanceStore } from "../store/financeStore";
import { formatCurrency, formatDate, generateExpenseStats, groupExpensesByCategory } from "../utils/formatters";

const AddExpenseScreen = ({ navigation }) => {
  const { expenses, addExpense, deleteExpense, monthlyIncome, currentMonthExpenses } = useFinanceStore();

  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [date, setDate] = useState(new Date().toISOString());
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState({ visible: false });

  const expenseRatio = monthlyIncome > 0 ? (currentMonthExpenses / monthlyIncome) * 100 : 0;
  const spendingStatus =
    monthlyIncome === 0
      ? { label: "Belum setup", color: COLORS.gray, icon: "settings-outline" }
      : expenseRatio > 85
        ? { label: "Ketat", color: COLORS.danger, icon: "alert-circle" }
        : expenseRatio > 60
          ? { label: "Pantau", color: COLORS.warning, icon: "eye-outline" }
          : { label: "Aman", color: COLORS.success, icon: "checkmark-circle" };

  const validateForm = () => {
    const errors = {};

    if (!description.trim()) {
      errors.description = "Deskripsi harus diisi";
    }

    if (!amount || parseFloat(amount) === 0) {
      errors.amount = "Nominal harus diisi";
    }

    if (!category) {
      errors.category = "Kategori harus dipilih";
    }

    return errors;
  };

  const handleAddExpense = () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
    });

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("Makanan");
    setDate(new Date().toISOString());
    setFormErrors({});
    setShowForm(false);

    setModal({
      visible: true,
      tone: "success",
      iconName: "checkmark-circle-outline",
      title: "Pengeluaran Tercatat",
      message: "Transaksi baru sudah masuk ke riwayat pengeluaran bulan ini.",
    });
  };

  const handleDeleteExpense = (id) => {
    setModal({
      visible: true,
      tone: "danger",
      iconName: "trash-outline",
      title: "Hapus Pengeluaran?",
      message: "Transaksi ini akan dihapus dari riwayat dan total pengeluaran bulan ini.",
      primaryLabel: "Hapus",
      secondaryLabel: "Batal",
      onPrimaryPress: () => {
        deleteExpense(id);
        setModal({ visible: false });
      },
    });
  };

  const groupedExpenses = groupExpensesByCategory(expenses);
  const stats = generateExpenseStats(expenses);
  const insets = useSafeAreaInsets();

  if (monthlyIncome === 0) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <EmptyState iconName="settings-outline" title="Setup Profil Terlebih Dahulu" subtitle="Lengkapi informasi keuangan Anda untuk mulai mencatat pengeluaran dan mendapatkan insight yang lebih baik." />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderExpenseItem = ({ item }) => (
    <Card style={styles.expenseItem}>
      <View style={styles.expenseRow}>
        <View style={styles.expenseLeft}>
          <Text style={styles.expenseCategory}>{item.category}</Text>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(item.id)}>
            <Ionicons name="trash" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Pengeluaran" title="Catatan Harian" subtitle="Catat transaksi kecil maupun besar agar pola belanja terlihat jelas." iconName="receipt-outline" color={COLORS.accent} />

        {!showForm && (
          <Card style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryIcon}>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.danger} />
              </View>
              <View style={styles.entryText}>
                <Text style={styles.entryTitle}>Catat cepat</Text>
                <Text style={styles.entrySubtitle}>Masukkan nominal, pilih kategori, selesai.</Text>
              </View>
            </View>
            <PrimaryButton title={expenses.length === 0 ? "Catat Pengeluaran Pertama" : "Tambah Pengeluaran"} iconName="add-circle-outline" onPress={() => setShowForm(true)} />
          </Card>
        )}

        {/* Stats */}
        {expenses.length > 0 && (
          <>
            <SectionHeader title="Statistik Pengeluaran" />
            <Card style={styles.spendingPulse}>
              <View style={styles.spendingPulseHeader}>
                <View>
                  <Text style={styles.spendingPulseLabel}>Ritme pengeluaran</Text>
                  <Text style={styles.spendingPulseValue}>{formatCurrency(currentMonthExpenses)}</Text>
                </View>
                <StatusPill label={spendingStatus.label} iconName={spendingStatus.icon} color={spendingStatus.color} />
              </View>
              <MoneyMeter
                label="Pemakaian pendapatan"
                value={currentMonthExpenses}
                limit={monthlyIncome}
                color={spendingStatus.color}
                helper={monthlyIncome > 0 ? `${expenseRatio.toFixed(1)}% dari pendapatan bulan ini` : "Isi pendapatan bulanan di Profil untuk melihat rasio"}
              />
            </Card>
            <View style={styles.statsGrid}>
              <Card style={styles.statBox}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.total)}</Text>
              </Card>
              <Card style={styles.statBox}>
                <Text style={styles.statLabel}>Rata-rata</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.average)}</Text>
              </Card>
            </View>
            <View style={styles.statsGrid}>
              <Card style={styles.statBox}>
                <Text style={styles.statLabel}>Tertinggi</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.highest)}</Text>
              </Card>
              <Card style={styles.statBox}>
                <Text style={styles.statLabel}>Terendah</Text>
                <Text style={styles.statValue}>{formatCurrency(stats.lowest)}</Text>
              </Card>
            </View>
          </>
        )}

        {/* Category Distribution */}
        {Object.keys(groupedExpenses).length > 0 && (
          <>
            <SectionHeader title="Distribusi Kategori" />
            {Object.values(groupedExpenses)
              .sort((a, b) => b.amount - a.amount)
              .map((cat) => (
                <CategoryBadge key={cat.category} category={cat.category} color={require("../constants").CATEGORY_COLORS[cat.category]} amount={formatCurrency(cat.amount)} percentage={cat.percentage.toFixed(1)} />
              ))}
          </>
        )}

        {/* Form (Modal) */}
        <BottomSheetFormModal
          visible={showForm}
          title="Catat Pengeluaran Baru"
          onClose={() => {
            setShowForm(false);
            setFormErrors({});
          }}
          primaryLabel="Simpan"
          secondaryLabel="Batal"
          primaryIconName="checkmark-outline"
          onSecondaryPress={() => {
            setShowForm(false);
            setFormErrors({});
          }}
          onPrimaryPress={handleAddExpense}
        >
          <FormInput label="Deskripsi Pengeluaran" placeholder="Contoh: Makan siang di restoran" value={description} onChangeText={setDescription} error={formErrors.description} />

          <CurrencyInput label="Nominal" value={amount} onChangeText={setAmount} error={formErrors.amount} />

          <DateTimePicker label="Tanggal Pengeluaran" value={date} onChangeDate={setDate} />

          <CategorySelector selectedCategory={category} onSelectCategory={setCategory} categories={CATEGORIES} />
          {formErrors.category && <Text style={styles.formError}>{formErrors.category}</Text>}
        </BottomSheetFormModal>

        {/* Expenses List */}
        {sortedExpenses.length > 0 && (
          <>
            <SectionHeader title="Riwayat Pengeluaran" subtitle={`${sortedExpenses.length} transaksi`} />
            <FlatList scrollEnabled={false} data={sortedExpenses} keyExtractor={(item) => item.id.toString()} renderItem={renderExpenseItem} ListEmptyComponent={<EmptyState iconName="receipt-outline" title="Belum ada pengeluaran" />} />
          </>
        )}

        {!showForm && expenses.length === 0 && <EmptyState iconName="card-outline" title="Mulai Catat Pengeluaran" subtitle="Tekan tombol di bawah untuk menambahkan pengeluaran pertama Anda" />}

        <View style={styles.spacing} />
      </ScrollView>

      {/* Floating Action Button */}
      {!showForm && (
        <PrimaryButton
          title="Catat"
          iconName="add-circle-outline"
          onPress={() => setShowForm(true)}
          style={[
            styles.fab,
            {
              backgroundColor: COLORS.accent,
              bottom: insets.bottom + 8,
              right: 16,
            },
          ]}
        />
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
    paddingBottom: 90,
  },
  entryCard: {
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  entryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  entryText: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.dark,
    marginBottom: 3,
  },
  entrySubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 17,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  spendingPulse: {
    marginBottom: 16,
  },
  spendingPulseHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  spendingPulseLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  spendingPulseValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.dark,
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
  formCard: {
    marginBottom: 20,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  formError: {
    marginTop: -8,
    marginBottom: 12,
    fontSize: 12,
    color: COLORS.danger,
  },
  expenseItem: {
    marginBottom: 10,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseLeft: {
    flex: 1,
  },
  expenseRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  expenseCategory: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 2,
  },
  expenseDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 11,
    color: COLORS.gray,
  },
  expenseAmount: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.danger,
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 96,
    right: 18,
    width: 116,
    borderRadius: 999,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  spacing: {
    height: 20,
  },
});

export default AddExpenseScreen;
