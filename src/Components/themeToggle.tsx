import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeColors = {
  primaryColor: string;
  secondaryColor: string;
  background: string;
  text: string;
  nav: string;
};

type ThemeContextType = {
  theme: ThemeColors;
  toggleThemeMode: () => void;
  toggleColorTheme: () => void;
  isDarkMode: boolean;
};

const lightThemeBase: ThemeColors = {
  primaryColor: "#DD00FF",
  secondaryColor: "#7650FF",
  background: "#FFFFFF",
  text: "#000000",
  nav: "#FFFFFF"
};

const darkThemeBase: ThemeColors = {
  primaryColor: "#DD00FF",
  secondaryColor: "#7650FF",
  background: "#222021",
  text: "#FFFFFF",
  nav: "#48494B",
};

const colorThemes = [
  { primaryColor: "#DD00FF", secondaryColor: "#7650FF" }, // Theme 1
  { primaryColor: "#FF8800", secondaryColor: "#FF0004" }, // Theme 2
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme: ColorSchemeName = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [themeIndex, setThemeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // ⬅️ avoid showing flicker before loading saved theme

  // Load stored preferences on mount
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("theme:isDarkMode");
        const savedThemeIndex = await AsyncStorage.getItem("theme:themeIndex");

        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === "true");
        if (savedThemeIndex !== null) setThemeIndex(Number(savedThemeIndex));
      } catch (error) {
        console.warn("Failed to load theme preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadThemePreferences();
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem("theme:isDarkMode", isDarkMode.toString());
      AsyncStorage.setItem("theme:themeIndex", themeIndex.toString());
    }
  }, [isDarkMode, themeIndex]);

  const toggleThemeMode = () => setIsDarkMode((prev) => !prev);
  const toggleColorTheme = () => setThemeIndex((prev) => (prev + 1) % colorThemes.length);

  const baseTheme = isDarkMode ? darkThemeBase : lightThemeBase;
  const colors = colorThemes[themeIndex];

  const theme: ThemeColors = {
    ...baseTheme,
    primaryColor: colors.primaryColor,
    secondaryColor: colors.secondaryColor,
  };

  // Wait until theme is loaded before showing the app
  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleThemeMode, toggleColorTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};