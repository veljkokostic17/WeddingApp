import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorView } from "@/components/error-view";
import { Palette, tileGradients } from "@/constants/paper-theme";
import { Layout, Type } from "@/constants/typography";
import { useFavorites } from "@/context/favorites-context";
import { useFetch } from "@/hooks/use-fetch";
import { Category } from "@/types/category";

export default function MyWeddingScreen() {
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useFetch<Category[]>("/category");
  const { favorites, loading: favoritesLoading } = useFavorites();

  if (loading || favoritesLoading)
    return (
      <View style={Layout.center}>
        <ActivityIndicator />
      </View>
    );

  if (error) return <ErrorView message={error} onRetry={refetch} />;

  const total = categories?.length ?? 0;
  const chosenCount = favorites.filter((f) => f.isChosen).length;
  // Guard the divide — total is 0 for the one frame before /category lands.
  const percent = total === 0 ? 0 : Math.round((chosenCount / total) * 100);

  return (
    <SafeAreaView style={Layout.screen} edges={["top"]}>
      <FlatList
        data={categories ?? []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={Type.h1}>Moje venčanje</Text>
            <View style={styles.rule} />
            <Text style={Type.metaSmall}>Vaš izbor po kategorijama</Text>

            <Text style={[Type.accent, styles.progressLabel]}>
              {chosenCount} od {total} izabrano
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${percent}%` }]} />
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          // The row belongs to the CATEGORY; the vendor is whatever is chosen in
          // it, if anything. undefined = an empty slot, which is the point of
          // the screen.
          const chosen = favorites.find(
            (f) => f.categoryId === item.id && f.isChosen
          );

          return (
            <Pressable
              style={styles.row}
              onPress={() =>
                chosen
                  ? router.push({
                      pathname: "/vendor/[id]",
                      params: { id: chosen.vendorId },
                    })
                  : router.push("/favorites")
              }
              accessibilityRole="button"
              accessibilityLabel={
                chosen
                  ? item.name + ": " + chosen.vendorName
                  : item.name + ": nije izabrano, izaberite iz omiljenih"
              }
            >
              <View style={styles.thumb}>
                {chosen?.coverPhotoUrl != null ? (
                  <Image
                    source={{ uri: chosen.coverPhotoUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                ) : chosen ? (
                  <LinearGradient
                    colors={tileGradients[index % tileGradients.length]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
              </View>

              <View style={styles.rowText}>
                <Text style={Type.sectionLabel}>{item.name}</Text>
                <Text
                  style={chosen ? styles.vendorName : styles.emptyText}
                  numberOfLines={1}
                >
                  {chosen ? chosen.vendorName : "Nije izabrano"}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.charcoalSoft}
              />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { paddingTop: 14, paddingBottom: 18 },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 12,
    marginBottom: 10,
  },

  progressLabel: { marginTop: 18, marginBottom: 7 },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.creamDeep,
    overflow: "hidden",
  },
  fill: { height: 4, borderRadius: 2, backgroundColor: Palette.gold },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Palette.creamDeep,
  },
  rowText: { flex: 1, gap: 3 },
  vendorName: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 17,
    color: Palette.charcoal,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Palette.charcoalSoft,
    fontStyle: "italic",
  },
});
