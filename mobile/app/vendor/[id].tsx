import { Palette } from "@/constants/paper-theme";
import { useFetch } from "@/hooks/use-fetch";
import { Vendor } from "@/types/vendor";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VendorScreen() {
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: vendor,
    loading,
    error,
  } = useFetch<Vendor>(id ? "/vendor/" + id : null);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  if (!vendor)
    return (
      <View style={styles.center}>
        <Text>Objekat nije pronađen</Text>
      </View>
    );

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.hero}>
        {vendor.photos.length > 0 ? (
          <Image
            source={{ uri: vendor.photos[0].imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={["#D9BFAE", Palette.blush, Palette.creamDeep]}
            style={StyleSheet.absoluteFill}
          />
        )}

        <Pressable
          style={[styles.heroBtn, styles.heroBtnBack, { top: insets.top + 14 }]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={21} color={Palette.charcoal} />
        </Pressable>

        <Pressable
          style={[styles.heroBtn, styles.heroBtnFav, { top: insets.top + 14 }]}
          hitSlop={8}
        >
          <Ionicons name="heart-outline" size={21} color={Palette.deepGold} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{vendor.name}</Text>
        <View style={styles.rule} />

        {vendor.capacity != null && (
          <View style={styles.metaRow}>
            <Ionicons
              name="people-outline"
              size={13}
              color={Palette.charcoalSoft}
            />
            <Text style={styles.metaText}>Do {vendor.capacity} gostiju</Text>
          </View>
        )}

        <Text style={styles.desc}>{vendor.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.cream,
  },

  body: { paddingHorizontal: 20, paddingTop: 16 },
  name: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 22,
    color: Palette.charcoal,
  },
  rule: {
    width: 28,
    height: 1,
    backgroundColor: Palette.deepGold,
    marginTop: 8,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 12,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    color: Palette.charcoalSoft,
  },

  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: Palette.charcoalSoft,
    marginBottom: 16,
  },
  hero: { height: 190, backgroundColor: Palette.creamDeep, overflow: "hidden" },
  heroImage: { width: "100%", height: "100%" },
  heroBtn: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBtnBack: { left: 14 },
  heroBtnFav: { right: 14 },
});
