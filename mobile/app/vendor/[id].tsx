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
import { ErrorView } from "@/components/error-view";
import { FavoriteHeart } from "@/components/favorite-heart";
import { VendorGallery } from "@/components/vendor-gallery";
import { VendorOfferings } from "@/components/vendor-offerings";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { useState } from "react";

export default function VendorScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [openAt, setOpenAt] = useState<number | null>(null);

  const {
    data: vendor,
    loading,
    error,
    refetch,
  } = useFetch<Vendor>(id ? "/vendor/" + id : null);

  if (loading)
    return (
      <View style={Layout.center}>
        <ActivityIndicator />
      </View>
    );

  if (error) return <ErrorView message={error} onRetry={refetch} />;

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
            <Pressable
              onPress={() => setOpenAt(0)}
              accessibilityRole="imagebutton"
              accessibilityLabel="Otvori fotografiju 1"
            >
              <Image
                source={{ uri: vendor.photos[0].imageUrl }}
                style={styles.heroImage}
                contentFit="cover"
              />
            </Pressable>
          ) : (
            <LinearGradient
              colors={["#D9BFAE", Palette.blush, Palette.creamDeep]}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.chip}>
            <Text style={Type.sectionLabel}>{vendor.categoryName}</Text>
          </View>

          <Text style={Type.h1}>{vendor.name}</Text>
          <View style={styles.rule} />

          {vendor.address != null && (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color={Palette.charcoalSoft}
              />
              <Text style={Type.meta}>{vendor.address}</Text>
            </View>
          )}

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

          <VendorOfferings offerings={vendor.offerings} />

          <VendorGallery
            photos={vendor.photos.slice(1)}
            onOpen={(i) => setOpenAt(i + 1)}
          />

          {vendor.capacity != null && vendor.capacity > 0 && (
            <VendorCalendar unavailableDates={vendor.unavailableDates} />
          )}

          <View style={styles.note}>
            <Text style={[Type.metaSmall, styles.noteText]}>
              Za informacije o cenama i terminima
            </Text>
            <Text style={[Type.accent, styles.noteText]}>
              kontaktirajte direktno vendora
            </Text>
          </View>

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
                <Text style={[Type.button, styles.btnTextOutline]}>
                  Instagram
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.heroBtn, styles.heroBtnBack, { top: insets.top + 14 }]}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Nazad"
      >
        <Ionicons name="chevron-back" size={21} color={Palette.charcoal} />
      </Pressable>

      <FavoriteHeart
        vendorId={vendor.id}
        vendorName={vendor.name}
        size={21}
        style={[styles.heroBtn, styles.heroBtnFav, { top: insets.top + 14 }]}
      />

      <PhotoLightbox
        photos={vendor.photos}
        openAt={openAt}
        onClose={() => setOpenAt(null)}
      />
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
    marginBottom: 7,
  },
  desc: { marginTop: 7, marginBottom: 18 },

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

  // Category eyebrow, boxed — the mockup's pill above the vendor name.
  chip: {
    alignSelf: "flex-start",
    backgroundColor: Palette.creamDeep,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginBottom: 12,
  },

  note: {
    alignItems: "center",
    backgroundColor: Palette.creamDeep,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  noteText: { textAlign: "center" },

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
