import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { PrimaryButton, SecondaryButton } from "./Buttons";

export default function BottomSheetFormModal({
  visible,
  title,
  onClose,
  children,
  primaryLabel = "Simpan",
  secondaryLabel = "Batal",
  onPrimaryPress,
  onSecondaryPress,
  tone = "primary",
  primaryIconName = "checkmark-outline",
  contentStyle,
}) {
  const insets = useSafeAreaInsets();
  const toneColor = {
    primary: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
    danger: COLORS.danger,
  }[tone];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop sebagai layer terpisah */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet naik bareng keyboard */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kavContainer} pointerEvents="box-none">
        <SafeAreaView edges={["bottom"]} style={[styles.sheetWrap, { marginBottom: -insets.bottom }]}>
          <View style={styles.sheet}>
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={[styles.contentInner, contentStyle]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
              <SecondaryButton title={secondaryLabel} onPress={onSecondaryPress || onClose} style={[styles.footerBtn, { backgroundColor: COLORS.light }]} />
              <PrimaryButton title={primaryLabel} iconName={primaryIconName} onPress={onPrimaryPress} style={[styles.footerBtn, { backgroundColor: toneColor }]} />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.55)",
  },
  kavContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  // sisanya sama persis seperti sebelumnya
  sheetWrap: {
    padding: 16,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 18,
    maxHeight: "85%",
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.18)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.dark,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(2,6,23,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    maxHeight: "70%",
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  footerBtn: {
    flex: 1,
  },
});
