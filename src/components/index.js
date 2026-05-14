import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";
import BottomSheetFormModal from "./BottomSheetFormModal";
import { PrimaryButton, SecondaryButton } from "./Buttons";

export { default as KiranaHeader } from "./KiranaHeader";
export { BottomSheetFormModal, PrimaryButton, SecondaryButton };

export const Card = ({ style, children, onPress, ...props }) => {
  const content = (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
};

export const StatCard = ({ label, value, icon, iconName, color = COLORS.primary, style }) => {
  return (
    <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }, style]}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        {iconName ? <Ionicons name={iconName} size={22} color={color} /> : icon && <Text style={styles.statIcon}>{icon}</Text>}
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
};

export const CategoryBadge = ({ category, color, amount, percentage, onPress }) => {
  return (
    <TouchableOpacity style={[styles.categoryBadge, { backgroundColor: color }]} onPress={onPress}>
      <View style={styles.badgeContent}>
        <Text style={styles.categoryName}>{category}</Text>
        <View style={styles.badgeStats}>
          <Text style={styles.badgeAmount}>{amount}</Text>
          <Text style={styles.badgePercentage}>{percentage}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SectionHeader = ({ title, subtitle, action, onActionPress }) => {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const AllocationBar = ({ label, percentage, color, amount }) => {
  return (
    <View style={styles.allocationBar}>
      <View style={styles.allocationHeader}>
        <Text style={styles.allocationLabel}>{label}</Text>
        <Text style={styles.allocationAmount}>{amount}</Text>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.allocationPercentage}>{percentage.toFixed(1)}%</Text>
    </View>
  );
};

export const ScreenHeader = ({ eyebrow, title, subtitle, iconName, color = COLORS.primary, rightContent }) => {
  return (
    <View style={[styles.screenHeader, { backgroundColor: color }]}>
      <View style={styles.screenHeaderTop}>
        {iconName && (
          <View style={styles.screenHeaderIcon}>
            <Ionicons name={iconName} size={24} color={COLORS.white} />
          </View>
        )}
        {rightContent}
      </View>
      {eyebrow && <Text style={styles.screenEyebrow}>{eyebrow}</Text>}
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
    </View>
  );
};

export const MoneyMeter = ({ label, value, limit, color = COLORS.primary, helper, inverse = false }) => {
  const percentage = limit > 0 ? Math.min((value / limit) * 100, 100) : 0;
  const textColor = inverse ? COLORS.white : COLORS.dark;
  const mutedColor = inverse ? "rgba(255,255,255,0.74)" : COLORS.gray;

  return (
    <View style={styles.moneyMeter}>
      <View style={styles.meterHeader}>
        <Text style={[styles.meterLabel, { color: textColor }]}>{label}</Text>
        <Text style={[styles.meterValue, { color: mutedColor }]}>{percentage.toFixed(0)}%</Text>
      </View>
      <View style={[styles.meterTrack, inverse && styles.meterTrackInverse]}>
        <View style={[styles.meterFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      {helper && <Text style={[styles.meterHelper, { color: mutedColor }]}>{helper}</Text>}
    </View>
  );
};

export const QuickActionCard = ({ title, subtitle, iconName, color = COLORS.primary, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={iconName} size={22} color={color} />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        {subtitle && <Text style={styles.quickActionSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
    </TouchableOpacity>
  );
};

export const InsightChip = ({ label, value, iconName, color = COLORS.primary }) => {
  return (
    <View style={[styles.insightChip, { borderColor: `${color}30` }]}>
      <View style={[styles.insightIcon, { backgroundColor: `${color}16` }]}>
        <Ionicons name={iconName} size={16} color={color} />
      </View>
      <View style={styles.insightText}>
        <Text style={styles.insightLabel}>{label}</Text>
        <Text style={styles.insightValue}>{value}</Text>
      </View>
    </View>
  );
};

export const StatusPill = ({ label, iconName, color = COLORS.primary, style }) => {
  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}18` }, style]}>
      {iconName && <Ionicons name={iconName} size={14} color={color} />}
      <Text numberOfLines={1} style={[styles.statusPillText, { color }]}>
        {label}
      </Text>
    </View>
  );
};

export const AppModal = ({ visible, title, message, iconName = "information-circle-outline", tone = "primary", primaryLabel = "OK", secondaryLabel, onPrimaryPress, onSecondaryPress, onClose, children }) => {
  const toneColor = {
    primary: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
    danger: COLORS.danger,
  }[tone];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose || onSecondaryPress || onPrimaryPress}>
      <View style={styles.modalBackdrop}>
        <View style={styles.appModal}>
          <View style={[styles.modalIcon, { backgroundColor: `${toneColor}18` }]}>
            <Ionicons name={iconName} size={34} color={toneColor} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          {message && <Text style={styles.modalMessage}>{message}</Text>}
          {children}
          <View style={styles.modalActions}>
            {secondaryLabel && <SecondaryButton title={secondaryLabel} onPress={onSecondaryPress || onClose} style={styles.modalButton} />}
            <PrimaryButton title={primaryLabel} onPress={onPrimaryPress || onClose} style={[styles.modalButton, { backgroundColor: toneColor }]} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const EmptyState = ({ icon, iconName, title, subtitle, action, onActionPress }) => {
  return (
    <View style={styles.emptyState}>
      {iconName ? (
        <View style={styles.emptyIconCircle}>
          <Ionicons name={iconName} size={42} color={COLORS.primary} />
        </View>
      ) : (
        <Text style={styles.emptyIcon}>{icon}</Text>
      )}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {action && <PrimaryButton title={action} onPress={onActionPress} style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  categoryBadge: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  badgeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
  },
  badgeStats: {
    flexDirection: "row",
    gap: 10,
  },
  badgeAmount: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "500",
  },
  badgePercentage: {
    color: COLORS.white,
    fontSize: 11,
    opacity: 0.9,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  insightChip: {
    flex: 1,
    minWidth: 132,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  insightIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    minWidth: 0,
  },
  insightLabel: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  insightValue: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: COLORS.light,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  sectionAction: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  screenHeader: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    overflow: "hidden",
  },
  screenHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 34,
    marginBottom: 8,
  },
  screenHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  screenEyebrow: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.78,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  screenTitle: {
    fontSize: 23,
    color: COLORS.white,
    fontWeight: "800",
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.82,
    lineHeight: 18,
  },
  allocationBar: {
    marginBottom: 20,
  },
  allocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  allocationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
  },
  allocationAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  allocationPercentage: {
    fontSize: 11,
    color: COLORS.gray,
  },
  moneyMeter: {
    marginTop: 14,
  },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  meterLabel: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: "600",
  },
  meterValue: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "700",
  },
  meterTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.light,
    overflow: "hidden",
  },
  meterTrackInverse: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  meterFill: {
    height: "100%",
    borderRadius: 5,
  },
  meterHelper: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.gray,
  },
  quickActionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 15,
  },
  statusPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    maxWidth: "100%",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.54)",
    justifyContent: "center",
    padding: 22,
  },
  appModal: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  modalIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.dark,
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 6,
  },
  modalButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
});
