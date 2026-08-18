import { StyleSheet } from "react-native";
import { Palette } from "./paper-theme";

/**
 * Named text styles. Family, size and color live here only — screens compose
 * these with spacing, e.g. style={[Type.body, { marginBottom: 18 }]}.
 *
 * Sizes are the corrected on-device scale, not the mockup's literal values —
 * see mobile/design/type-scale.md before changing any of them.
 */
export const Type = StyleSheet.create({
  /** Hero couple names. Playfair, the largest thing on any screen. */
  display: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
    color: Palette.charcoal,
  },
  /** Screen title — vendor name, category name. */
  h1: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 26,
    color: Palette.charcoal,
  },
  /** Vendor name overlaid on a card photo. White + shadow to survive any image. */
  cardTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  /** Category name overlaid on a Home grid tile. */
  tileLabel: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /** Gold uppercase kicker above a heading (the countdown line). */
  eyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: Palette.deepGold,
  },
  /** Same shape as eyebrow, muted — section headers like KATEGORIJE, DOSTUPNOST. */
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: Palette.charcoalSoft,
  },

  /** Running text — descriptions, the hero date. */
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 23,
    color: Palette.charcoalSoft,
  },
  /** Secondary one-liners — address, capacity. */
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Palette.charcoalSoft,
  },
  /** Smaller still — the count subline under a screen title. */
  metaSmall: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Palette.charcoalSoft,
  },
  /** Short emphasised value in gold — "Do 200 gostiju". */
  accent: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Palette.deepGold,
  },
  /** Button label. Color is set per button (solid vs outline). */
  button: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
});

/** Layout shells every screen repeats. */
export const Layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.cream,
  },
});
