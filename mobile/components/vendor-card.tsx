import { Palette, tileGradients } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { VendorListItem } from "@/types/vendor";
import { FavoriteHeart } from "./favorite-heart";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  vendorListItem: VendorListItem;
  /** Position in the list — picks which placeholder gradient to use. */
  index: number;
  /**
   * Favorites screen only. Passing a handler opts the card into showing the
   * "chosen for this category" control; the category list passes neither.
   */
  chosen?: boolean;
  onToggleChosen?: () => void;
};

export function VendorCard({
  vendorListItem,
  index,
  chosen = false,
  onToggleChosen,
}: Props) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/vendor/[id]", params: { id: vendorListItem.id } })
      }
    >
      <View style={styles.card}>
        <View style={styles.photo}>
          {vendorListItem.coverPhotoUrl != null ? (
            <Image
              source={{ uri: vendorListItem.coverPhotoUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : (
            <LinearGradient
              colors={tileGradients[index % tileGradients.length]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          <LinearGradient
            colors={["transparent", "rgba(54,47,39,0.6)"]}
            style={styles.photoScrim}
          />

          <FavoriteHeart
            vendorId={vendorListItem.id}
            vendorName={vendorListItem.name}
            size={17}
            style={styles.heartBtn}
          />

          <Text style={[Type.cardTitle, styles.vName]} numberOfLines={1}>
            {vendorListItem.name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[Type.meta, styles.vAddr]} numberOfLines={1}>
            {vendorListItem.address}
          </Text>
          {vendorListItem.capacity != null && vendorListItem.capacity > 0 && (
            <Text style={Type.accent}>Do {vendorListItem.capacity} gostiju</Text>
          )}

          {onToggleChosen != null && (
            <Pressable
              onPress={onToggleChosen}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ selected: chosen }}
              accessibilityLabel={
                chosen
                  ? vendorListItem.name + " je izabran"
                  : "Izaberi " + vendorListItem.name
              }
            >
              <Text style={[Type.accent, !chosen && styles.chooseInactive]}>
                {chosen ? "★ Izabrano" : "☆ Izaberi"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 12 },
  photo: {
    height: 125,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 9,
  },
  photoScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  heartBtn: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  vName: { paddingHorizontal: 12, paddingBottom: 9 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  },
  vAddr: { flex: 1 },
  chooseInactive: { color: Palette.charcoalSoft },
});
