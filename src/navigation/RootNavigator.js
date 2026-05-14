import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";

// Screens
import AddExpenseScreen from "../screens/AddExpenseScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ExpenseDetailScreen from "../screens/ExpenseDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RecommendationScreen from "../screens/RecommendationScreen";
import SavingsDetailScreen from "../screens/SavingsDetailScreen";
import SavingsScreen from "../screens/SavingsScreen";

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
  const insets = useSafeAreaInsets();

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
              borderTopWidth: 1,
              borderTopColor: COLORS.light,

              height: 60 + insets.bottom,
              paddingBottom: insets.bottom + 6,
              paddingTop: 6,

              shadowColor: "transparent",
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "700",
              marginTop: 0,
              paddingBottom: 2,
            },
            tabBarItemStyle: {
              borderRadius: 0,
              marginHorizontal: 0,
              paddingVertical: 0,
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
