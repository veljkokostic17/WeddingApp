import { Palette, tileGradients } from "@/constants/paper-theme";
import { Vendor } from "@/types/vendor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  vendor: Vendor;
  /** Position in the list — picks which placeholder gradient to use. */
  index: number;
};

export function VendorCard({ vendor, index }: Props) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/vendor/[id]", params: { id: vendor.id } })
      }
    >
      <View style={styles.card}>
        <View style={styles.photo}>
          {vendor.photos.length > 0 ? (
            <Image
              source={{ uri: vendor.photos[0].imageUrl }}
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

          {/* Visual-only for now — favorite toggle needs auth (wired up with login later) */}
          <Pressable
            style={styles.heartBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={"Sačuvaj " + vendor.name + " u omiljene"}
          >
            <Ionicons name="heart-outline" size={17} color={Palette.deepGold} />
          </Pressable>

          <Text style={styles.vName} numberOfLines={1}>
            {vendor.name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.vAddr} numberOfLines={1}>
            {vendor.address}
          </Text>
          {vendor.capacity != null && vendor.capacity > 0 && (
            <Text style={styles.vCap}>Do {vendor.capacity} gostiju</Text>
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
  vName: {
    color: "#fff",
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 18,
    paddingHorizontal: 12,
    paddingBottom: 9,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  },
  vAddr: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Palette.charcoalSoft,
  },
  vCap: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Palette.deepGold,
  },
});
