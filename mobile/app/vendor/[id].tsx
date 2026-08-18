import { Palette } from "@/constants/paper-theme";
import { Type, Layout } from "@/constants/typography";
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
      <View style={Layout.center}>
        <ActivityIndicator />
      </View>
    );
  if (error)
    return (
      <View style={Layout.center}>
        <Text>{error}</Text>
      </View>
    );
  if (!vendor)
    return (
      <View style={Layout.center}>
        <Text>Objekat nije pronađen</Text>
      </View>
    );

  return (
    <View style={Layout.screen}>
      <ScrollView>
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
        </View>

        <View style={styles.body}>
          <Text style={Type.h1}>{vendor.name}</Text>
          <View style={styles.rule} />

          {vendor.capacity != null && vendor.capacity > 0 && (
            <View style={styles.metaRow}>
              <Ionicons
                name="people-outline"
                size={16}
                color={Palette.charcoalSoft}
              />
              <Text style={Type.meta}>Do {vendor.capacity} gostiju</Text>
            </View>
          )}

          <Text style={[Type.body, styles.desc]}>{vendor.description}</Text>

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
              <Text style={[Type.button, styles.btnTextSolid]}>Pozovi</Text>
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
                <Text style={[Type.button, styles.btnTextOutline]}>Instagram</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Siblings of the ScrollView, not children of the hero — they stay pinned
          in view while the photo and body scroll underneath. */}
      <Pressable
        style={[styles.heroBtn, styles.heroBtnBack, { top: insets.top + 14 }]}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Nazad"
      >
        <Ionicons name="chevron-back" size={21} color={Palette.charcoal} />
      </Pressable>

      <Pressable
        style={[styles.heroBtn, styles.heroBtnFav, { top: insets.top + 14 }]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={"Sačuvaj " + vendor.name + " u omiljene"}
      >
        <Ionicons name="heart-outline" size={21} color={Palette.deepGold} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
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
  desc: { marginBottom: 18 },

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
  btnTextSolid: { color: "#FFFFFF" },
  btnTextOutline: { color: Palette.charcoal },

  hero: { height: 230, backgroundColor: Palette.creamDeep, overflow: "hidden" },
  heroImage: { width: "100%", height: "100%" },
  heroBtn: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#362F27",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  heroBtnBack: { left: 14 },
  heroBtnFav: { right: 14 },
});
