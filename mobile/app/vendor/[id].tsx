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
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VendorCalendar } from "@/components/vendor-calendar";

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

        {vendor.capacity != null && vendor.capacity > 0 && (
          <View style={styles.metaRow}>
            <Ionicons
              name="people-outline"
              size={16}
              color={Palette.charcoalSoft}
            />
            <Text style={styles.metaText}>Do {vendor.capacity} gostiju</Text>
          </View>
        )}

        <Text style={styles.desc}>{vendor.description}</Text>

        {vendor.capacity != null && vendor.capacity > 0 && (
          <VendorCalendar unavailableDates={vendor.unavailableDates} />
        )}

        <View style={styles.contactRow}>
          <Pressable
            style={[styles.btn, styles.btnSolid]}
            onPress={() => Linking.openURL("tel:" + vendor.phone)}
            accessibilityRole="button"
            accessibilityLabel={"Pozovi " + vendor.name}
          >
            <Ionicons name="call-outline" size={17} color="#FFFFFF" />
            <Text style={styles.btnTextSolid}>Pozovi</Text>
          </Pressable>

          {vendor.instagramUrl != null && (
            <Pressable
              style={[styles.btn, styles.btnOutline]}
              onPress={() => Linking.openURL(vendor.instagramUrl!)}
              accessibilityRole="button"
              accessibilityLabel={"Instagram profil " + vendor.name}
            >
              <Ionicons
                name="logo-instagram"
                size={17}
                color={Palette.charcoal}
              />
              <Text style={styles.btnTextOutline}>Instagram</Text>
            </Pressable>
          )}
        </View>
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

  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  name: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 26,
    color: Palette.charcoal,
  },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.deepGold,
    marginTop: 9,
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Palette.charcoalSoft,
  },

  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 23,
    color: Palette.charcoalSoft,
    marginBottom: 18,
  },

  contactRow: { flexDirection: "row", gap: 9, marginTop: 4, marginBottom: 22 },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 14,
    paddingVertical: 13,
  },
  btnSolid: { backgroundColor: Palette.gold },
  btnOutline: { borderWidth: 2, borderColor: Palette.blushDeep },
  btnTextSolid: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  btnTextOutline: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Palette.charcoal,
  },

  hero: { height: 230, backgroundColor: Palette.creamDeep, overflow: "hidden" },
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
