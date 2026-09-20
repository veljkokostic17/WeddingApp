import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { paperTheme, Palette } from "@/constants/paper-theme";
import {
  useFonts,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

// Light-only design — always use the cream theme, ignore the phone's dark mode.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.cream,
    card: Palette.cream,
  },
};

function RootLayoutNav() {
  const { bootstrapping, user } = useAuth();

  useEffect(() => {
    if (!bootstrapping) SplashScreen.hideAsync();
  }, [bootstrapping]);

  if (bootstrapping) {
    return null;
  }

  return (
    <ThemeProvider value={navTheme}>
      <Stack>
        <Stack.Protected guard={user != null}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={user == null}>
          <Stack.Screen name="sign-in/login" options={{ headerShown: false }} />
          <Stack.Screen
            name="sign-in/register"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="vendor/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <KeyboardProvider>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <FavoritesProvider>
            <RootLayoutNav />
          </FavoritesProvider>
        </AuthProvider>
      </PaperProvider>
    </KeyboardProvider>
  );
}
