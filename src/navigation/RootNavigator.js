import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SavingsScreen from "../screens/SavingsScreen";
import RecommendationScreen from "../screens/RecommendationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ExpenseDetailScreen from "../screens/ExpenseDetailScreen";
import SavingsDetailScreen from "../screens/SavingsDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{
          headerTitle: "Dashboard Keuangan",
        }}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Detail Pengeluaran",
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.dark,
        }}
      />
    </Stack.Navigator>
  );
};

// Savings Stack
const SavingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SavingsHome"
        component={SavingsScreen}
        options={{
          headerTitle: "Tabungan & Tujuan",
        }}
      />
      <Stack.Screen
        name="SavingsDetail"
        component={SavingsDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Detail Tabungan",
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.dark,
        }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }} edges={["top"]}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color }) => {
              let iconName;

              switch (route.name) {
                case "Dashboard":
                  iconName = focused ? "home" : "home-outline";
                  break;
                case "AddExpense":
                  iconName = focused ? "add-circle" : "add-circle-outline";
                  break;
                case "Savings":
                  iconName = focused ? "wallet" : "wallet-outline";
                  break;
                case "Recommendation":
                  iconName = focused ? "bulb" : "bulb-outline";
                  break;
                case "Profile":
                  iconName = focused ? "person" : "person-outline";
                  break;
                default:
                  iconName = "home-outline";
              }

              return (
                <View
                  style={{
                    width: 42,
                    height: 30,
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: focused ? COLORS.surfaceAlt : "transparent",
                  }}
                >
                  <Ionicons name={iconName} size={focused ? 22 : 21} color={color} />
                </View>
              );
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
            tabBarStyle: {
              backgroundColor: COLORS.white,
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 12,
              borderTopWidth: 0,
              borderRadius: 22,
              paddingBottom: 10,
              paddingTop: 10,
              height: 72,
              shadowColor: "#111827",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.14,
              shadowRadius: 18,
              elevation: 12,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "700",
              marginTop: 2,
            },
            tabBarItemStyle: {
              borderRadius: 999,
              marginHorizontal: 2,
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardStack}
            options={{
              tabBarLabel: "Beranda",
            }}
          />
          <Tab.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{
              tabBarLabel: "Pengeluaran",
            }}
          />
          <Tab.Screen
            name="Savings"
            component={SavingsStack}
            options={{
              tabBarLabel: "Tabungan",
            }}
          />
          <Tab.Screen
            name="Recommendation"
            component={RecommendationScreen}
            options={{
              tabBarLabel: "Rekomendasi",
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: "Profil",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
