import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

export const PrimaryButton = ({ title, onPress, style, disabled = false, loading = false, iconName, ...props }) => {
  return (
    <TouchableOpacity style={[styles.primaryButton, disabled && styles.buttonDisabled, style]} onPress={onPress} disabled={disabled || loading} {...props}>
      {iconName && <Ionicons name={iconName} size={18} color={COLORS.white} style={styles.buttonIcon} />}
      <Text style={styles.buttonText}>{loading ? "Memproses..." : title}</Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress, style, disabled = false, iconName, textColor, iconColor, ...props }) => {
  const resolvedTextColor = textColor || COLORS.primary;
  const resolvedIconColor = iconColor || COLORS.primary;

  return (
    <TouchableOpacity style={[styles.secondaryButton, disabled && styles.buttonDisabled, style]} onPress={onPress} disabled={disabled} {...props}>
      {iconName && <Ionicons name={iconName} size={18} color={resolvedIconColor} style={styles.buttonIcon} />}
      <Text style={[styles.secondaryButtonText, { color: resolvedTextColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
};
