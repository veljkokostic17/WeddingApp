import { Palette } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  /** The raw newline-delimited column off VendorDto. */
  offerings: string | null;
};

export function VendorOfferings({ offerings }: Props) {
  // Blank lines and stray whitespace are easy to leave behind when this is
  // edited as one text field in Swagger, so they're dropped here rather than
  // rendering an empty card.
  const items =
    offerings
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "") ?? [];

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <View style={styles.tick} />
        <Text style={Type.sectionLabel}>Šta nudimo</Text>
      </View>

      {/* Wraps into two columns at 48%, so an odd count leaves the last card
          on its own row rather than needing a fixed number of items. */}
      <View style={styles.grid}>
        {items.map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.bullet} />
            <Text style={[Type.meta, styles.cardText]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  tick: { width: 3, height: 13, borderRadius: 2, backgroundColor: Palette.gold },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  card: {
    width: "48%",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.gold,
    // Nudged down to sit on the first line's optical centre; a bullet in a
    // row flex would otherwise ride the top edge of a two-line label.
    marginTop: 6,
  },
  cardText: { flex: 1, color: Palette.charcoal, lineHeight: 19 },
});
