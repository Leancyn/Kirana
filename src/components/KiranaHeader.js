import { Image, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants";

const logo = require("../../assets/images/icon.png");

export default function KiranaHeader({ style }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.left}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Kirana</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 34,
    height: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.dark,
  },
});
