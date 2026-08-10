import { MD3LightTheme, configureFonts } from "react-native-paper";

export const Palette = {
  cream: "#FBF6EC",
  creamDeep: "#F3EAD9",
  charcoal: "#362F27",
  charcoalSoft: "#6B5F53",
  gold: "#B8935A",
  deepGold: "#8C6A3B",
  blush: "#E3B8B0",
  line: "#E8DFCF",
};

const baseFonts = configureFonts({
  config: { fontFamily: "Inter_400Regular" },
});

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Palette.deepGold,
    secondary: Palette.gold,
    tertiary: Palette.blush,
    background: Palette.cream,
    surface: "#FFFFFF",
    onPrimary: "#FFFFFF",
    onBackground: Palette.charcoal,
    onSurface: Palette.charcoal,
  },
  fonts: {
    ...baseFonts,
    displayLarge: {
      ...baseFonts.displayLarge,
      fontFamily: "PlayfairDisplay_700Bold",
    },
    displayMedium: {
      ...baseFonts.displayMedium,
      fontFamily: "PlayfairDisplay_700Bold",
    },
    displaySmall: {
      ...baseFonts.displaySmall,
      fontFamily: "PlayfairDisplay_600SemiBold",
    },
    headlineLarge: {
      ...baseFonts.headlineLarge,
      fontFamily: "PlayfairDisplay_700Bold",
    },
    headlineMedium: {
      ...baseFonts.headlineMedium,
      fontFamily: "PlayfairDisplay_600SemiBold",
    },
    headlineSmall: {
      ...baseFonts.headlineSmall,
      fontFamily: "PlayfairDisplay_600SemiBold",
    },
    titleLarge: {
      ...baseFonts.titleLarge,
      fontFamily: "PlayfairDisplay_600SemiBold",
    },
  },
};
