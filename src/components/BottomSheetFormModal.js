import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../constants";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const TONE_COLORS = {
  primary: COLORS.primary,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
};

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

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const toneColor = TONE_COLORS[tone] || COLORS.primary;

  useEffect(() => {
    const showSubscription = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const modalMaxHeight = keyboardVisible ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.72;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <View
          style={[
            styles.sheetWrap,
            {
              paddingBottom: Math.max(insets.bottom + 20),
            },
          ]}
        >
          <View
            style={[
              styles.sheet,
              {
                maxHeight: modalMaxHeight,
              },
            ]}
          >
            {/* Handle */}
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>

              <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={[
                styles.contentInner,
                contentStyle,
                {
                  paddingBottom: keyboardVisible ? 32 : 20,
                },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {/* Footer */}
            <View
              style={[
                styles.footer,
                {
                  paddingBottom: Math.max(insets.bottom, 14),
                },
              ]}
            >
              <SecondaryButton
                title={secondaryLabel}
                onPress={onSecondaryPress || onClose}
                style={[
                  styles.footerBtn,
                  {
                    backgroundColor: COLORS.light,
                  },
                ]}
              />

              <PrimaryButton
                title={primaryLabel}
                iconName={primaryIconName}
                onPress={onPrimaryPress}
                style={[
                  styles.footerBtn,
                  {
                    backgroundColor: toneColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17,24,39,0.55)",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheetWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  sheet: {
    backgroundColor: COLORS.white,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,

    elevation: 20,
  },

  handleRow: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.15)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  title: {
    flex: 1,
    marginRight: 12,

    fontSize: 16,
    fontWeight: "800",
    color: COLORS.dark,
  },

  closeBtn: {
    width: 36,
    height: 36,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(2,6,23,0.06)",
  },

  content: {
    flexGrow: 0,
  },

  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  footer: {
    flexDirection: "row",
    gap: 12,

    paddingHorizontal: 16,
    paddingTop: 14,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.light,
  },

  footerBtn: {
    flex: 1,
  },
});
