import AsyncStorage from "@react-native-async-storage/async-storage"
import { useColorScheme } from "nativewind"

const THEME_KEY = "APP_THEME"

export function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme()

  const isDark = colorScheme === "dark"
  const isLight = colorScheme === "light"

  const setTheme = async (theme: "light" | "dark") => {
    setColorScheme(theme)
    await AsyncStorage.setItem(THEME_KEY, theme)
  }

  const toggleTheme = async () => {
    const nextTheme = colorScheme === "dark" ? "light" : "dark"
    setColorScheme(nextTheme)
    await AsyncStorage.setItem(THEME_KEY, nextTheme)
  }

  return {
    theme: colorScheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
  }
}