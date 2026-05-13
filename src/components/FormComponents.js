import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";

export const FormInput = ({ label, placeholder, value, onChangeText, keyboardType = "default", style, error, prefix, multiline = false, numberOfLines = 1 }) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput style={[styles.input, { flex: 1 }]} placeholder={placeholder} placeholderTextColor={COLORS.gray} value={value} onChangeText={onChangeText} keyboardType={keyboardType} multiline={multiline} numberOfLines={numberOfLines} />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const FormPicker = ({ label, selectedValue, onValueChange, items = [], placeholder = "Pilih...", style, error }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const selectedLabel = items.find((item) => item.value === selectedValue)?.label || placeholder;

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={[styles.inputWrapper, error && styles.inputError]} onPress={() => setModalVisible(true)}>
        <Text style={[styles.input, { color: selectedValue ? COLORS.dark : COLORS.gray }]}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.pickerItemText}>{item.label}</Text>
                  {selectedValue === item.value && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const CurrencyInput = ({ label, value, onChangeText, style, error, currency = "Rp" }) => {
  const handleChange = (text) => {
    const numOnly = text.replace(/[^0-9]/g, "");
    onChangeText(numOnly);
  };

  const displayValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Text style={styles.prefix}>{currency}</Text>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="0" placeholderTextColor={COLORS.gray} value={displayValue} onChangeText={handleChange} keyboardType="decimal-pad" />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const CategorySelector = ({ selectedCategory, onSelectCategory, categories = [], style }) => {
  const { CATEGORY_COLORS } = require("../constants");
  const iconNames = {
    Makanan: "fast-food-outline",
    Transport: "car-outline",
    Utilitas: "flash-outline",
    Hiburan: "film-outline",
    Cicilan: "card-outline",
    Belanja: "bag-outline",
    Kesehatan: "medkit-outline",
    Lainnya: "cube-outline",
  };

  return (
    <View style={[styles.categorySelector, style]}>
      <Text style={styles.label}>Kategori</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={[styles.categoryOption, selectedCategory === category && styles.categoryOptionSelected]} onPress={() => onSelectCategory(category)}>
            <View style={[styles.categoryIconContainer, { backgroundColor: CATEGORY_COLORS[category] }]}>
              <Ionicons name={iconNames[category] || "pricetag-outline"} size={24} color={COLORS.white} />
            </View>
            <Text style={styles.categoryOptionText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// DatePickerModal Component - must be defined before DateTimePicker
const DatePickerModal = ({ date, onDateChange, onClose }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date(date));

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = daysInMonth(month, year);
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= days; i++) {
      daysArray.push(new Date(year, month, i));
    }

    return daysArray;
  };

  const daysArray = getDaysArray();
  const isFutureMonth = selectedDate > new Date();

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.dateModalOverlay}>
        <View style={styles.dateModalContent}>
          <View style={styles.dateModalHeader}>
            <TouchableOpacity
              onPress={() => {
                const prev = new Date(selectedDate);
                prev.setMonth(prev.getMonth() - 1);
                setSelectedDate(prev);
              }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.dateModalTitle}>{selectedDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</Text>

            <TouchableOpacity
              onPress={() => {
                const next = new Date(selectedDate);
                next.setMonth(next.getMonth() + 1);
                if (next <= new Date()) {
                  setSelectedDate(next);
                }
              }}
              disabled={isFutureMonth}
              style={{ opacity: isFutureMonth ? 0.3 : 1 }}
            >
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateWeekRow}>
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day, idx) => (
              <Text key={idx} style={styles.dateWeekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.dateCalendarGrid}>
            {daysArray.map((day, idx) => {
              const isSelected = day && day.toDateString() === selectedDate.toDateString();
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isFuture = day && day > new Date();

              return (
                <TouchableOpacity
                  key={idx}
                  disabled={isFuture}
                  style={[styles.dateCalendarDay, isSelected && styles.dateCalendarDaySelected, isToday && !isSelected && styles.dateCalendarDayToday, !day && { backgroundColor: "transparent" }, isFuture && { opacity: 0.3 }]}
                  onPress={() => {
                    if (day) {
                      setSelectedDate(day);
                    }
                  }}
                >
                  {day && <Text style={[styles.dateCalendarDayText, isSelected && styles.dateCalendarDayTextSelected]}>{day.getDate()}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.dateModalActions}>
            <TouchableOpacity style={[styles.dateModalButton, { backgroundColor: COLORS.light }]} onPress={onClose}>
              <Text style={{ color: COLORS.dark, fontSize: 14, fontWeight: "600" }}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dateModalButton, { backgroundColor: COLORS.primary }]} onPress={() => onDateChange(selectedDate)}>
              <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: "600" }}>Pilih</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const DateTimePicker = ({ label, value, onChangeDate, style, error }) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const dateObj = value ? new Date(value) : new Date();
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      onChangeDate?.(selectedDate.toISOString());
    }
    setShowDatePicker(false);
  };

  const handlePrevDay = () => {
    const prev = new Date(dateObj);
    prev.setDate(prev.getDate() - 1);
    onChangeDate?.(prev.toISOString());
  };

  const handleNextDay = () => {
    const next = new Date(dateObj);
    next.setDate(next.getDate() + 1);
    // Don't allow future dates
    if (next <= new Date()) {
      onChangeDate?.(next.toISOString());
    }
  };

  const isToday = dateObj.toDateString() === new Date().toDateString();
  const isFuture = dateObj > new Date();

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.datePickerWrapper, error && styles.inputError]}>
        <TouchableOpacity style={styles.dateArrowButton} onPress={handlePrevDay}>
          <Ionicons name="chevron-back" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateDisplay} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            {isToday && <Text style={styles.dateHint}>Hari ini</Text>}
            {isFuture && <Text style={[styles.dateHint, { color: COLORS.danger }]}>Tanggal masa depan</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.dateArrowButton, isFuture && { opacity: 0.3 }]} onPress={handleNextDay} disabled={isFuture}>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {showDatePicker && <DatePickerModal date={dateObj} onDateChange={handleDateChange} onClose={() => setShowDatePicker(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: COLORS.dark,
    fontSize: 14,
  },
  prefix: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    marginRight: 4,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  pickerItemText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  categorySelector: {
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryOption: {
    width: "23%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.light,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  categoryOptionText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.dark,
    textAlign: "center",
  },
  // Date Picker Styles
  datePickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
  },
  dateArrowButton: {
    padding: 8,
  },
  dateDisplay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.dark,
  },
  dateHint: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: "90%",
    maxWidth: 340,
  },
  dateModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateModalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
  },
  dateWeekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dateWeekDay: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.gray,
    width: "14.28%",
    textAlign: "center",
  },
  dateCalendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  dateCalendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  dateCalendarDaySelected: {
    backgroundColor: COLORS.primary,
  },
  dateCalendarDayToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dateCalendarDayText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.dark,
  },
  dateCalendarDayTextSelected: {
    color: COLORS.white,
  },
  dateModalActions: {
    flexDirection: "row",
    gap: 10,
  },
  dateModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
