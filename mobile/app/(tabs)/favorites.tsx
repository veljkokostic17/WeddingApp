import { ActivityIndicator, SectionList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VendorCard } from "@/components/vendor-card";
import { Palette } from "@/constants/paper-theme";
import { Layout, Type } from "@/constants/typography";
import { useFavorites } from "@/context/favorites-context";
import { Favorite } from "@/types/favorite";

type Section = {
  title: string;
  data: Favorite[];
};

// One section per category, in the order categories first appear in the list.
function groupByCategory(favorites: Favorite[]): Section[] {
  const sections: Section[] = [];

  for (const favorite of favorites) {
    const existing = sections.find((s) => s.title === favorite.categoryName);
    if (existing) {
      existing.data.push(favorite);
    } else {
      sections.push({ title: favorite.categoryName, data: [favorite] });
    }
  }

  return sections;
}

export default function FavoritesScreen() {
  const { favorites, loading, choose } = useFavorites();

  if (loading)
    return (
      <View style={Layout.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={Layout.screen} edges={["top"]}>
      <SectionList
        sections={groupByCategory(favorites)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={Type.h1}>Omiljeno</Text>
            <View style={styles.rule} />
            <Text style={Type.metaSmall}>Sačuvano: {favorites.length}</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={[Type.body, styles.empty]}>
            Još niste sačuvali nijednog dobavljača.
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[Type.sectionLabel, styles.sectionLabel]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item, index }) => (
          <VendorCard
            index={index}
            chosen={item.isChosen}
            onToggleChosen={() => void choose(item.vendorId).catch(() => {})}
            vendorListItem={{
              id: item.vendorId,
              name: item.vendorName,
              address: item.address,
              // Not carried on FavoriteDto — the card hides the row when null.
              capacity: null,
              coverPhotoUrl: item.coverPhotoUrl,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { paddingTop: 14, paddingBottom: 6 },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 12,
    marginBottom: 10,
  },
  sectionLabel: {
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: Palette.cream,
  },
  empty: { marginTop: 24, color: Palette.charcoalSoft },
});
