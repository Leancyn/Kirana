import { Platform } from "react-native";
import { appStorage as nativeAppStorage } from "./storage.native";
import { appStorage as webAppStorage } from "./storage.web";

export const appStorage = Platform.OS === "web" ? webAppStorage : nativeAppStorage;
