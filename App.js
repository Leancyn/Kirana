import React from "react";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { COLORS } from "./src/constants";

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <RootNavigator />
    </>
  );
}
