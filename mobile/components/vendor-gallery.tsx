import { Palette } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { VendorPhoto } from "@/types/vendor";
import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  /** Everything except the cover — the hero already shows photos[0]. */
  photos: VendorPhoto[];
  /**
   * Index WITHIN THIS STRIP. The caller owns the lightbox and holds the full
   * photo array, so it has to add 1 to get back to the real index.
   */
  onOpen: (index: number) => void;
};

export function VendorGallery({ photos, onOpen }: Props) {
  if (photos.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <View style={styles.tick} />
        <Text style={Type.sectionLabel}>Galerija</Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(photo) => photo.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Bleeds past the body's 20px padding so the strip runs to the screen
        // edge — that overflow is what reads as "there is more, scroll".
        style={styles.strip}
        contentContainerStyle={styles.stripContent}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => onOpen(index)}
            accessibilityRole="imagebutton"
            accessibilityLabel={"Otvori fotografiju " + (index + 2)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.tile}
              contentFit="cover"
            />
          </Pressable>
        )}
      />
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
  // The short gold bar the mockup puts before a section label.
  tick: { width: 3, height: 13, borderRadius: 2, backgroundColor: Palette.gold },

  strip: { marginHorizontal: -20 },
  stripContent: { paddingHorizontal: 20, gap: 9 },
  tile: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: Palette.creamDeep,
  },
});
