import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFetch } from "@/hooks/use-fetch";
import { Category } from "@/types/category";
import { Palette, tileGradients } from "@/constants/paper-theme";
import { Type, Layout } from "@/constants/typography";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";

export default function HomeScreen() {
  const { data: categories, loading, error } = useFetch<Category[]>('/category');

  if (loading) return <View style={Layout.center}><ActivityIndicator /></View>
  if (error) return <View style={Layout.center}><Text>{error}</Text></View>

  return (
    <SafeAreaView style={Layout.screen} edges={['top']}>
      <FlatList
        data={categories ?? []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={
          <View>
            {/* TODO: names/date/countdown are hardcoded — wire to the logged-in AppUser once mobile auth exists */}
            <View style={styles.hero}>
              <Text style={[Type.eyebrow, styles.heroEyebrow]}>128 dana do velikog dana</Text>
              <Text style={[Type.display, styles.heroCouple]}>
                Marija <Text style={styles.heroAmp}>&</Text> Petar
              </Text>
              <View style={styles.heroRule} />
              <Text style={Type.body}>Venčanje · 15. maj 2026.</Text>
            </View>
            <View style={styles.divider} />
            <Text style={[Type.sectionLabel, styles.sectionLabel]}>Kategorije</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable style={{ flex: 1 }} onPress={() => router.push({ pathname: '/category/[id]', params: { id: item.id, name: item.name }})}>
          <LinearGradient
          colors={tileGradients[index % tileGradients.length]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tile}
          >
            <LinearGradient
              colors={['transparent', 'rgba(54,47,39,0.4)']}
              style={styles.scrim}
              />
            <Text style={Type.tileLabel}>{item.name}</Text>
          </LinearGradient>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grid: { padding: 20, gap: 9 },
  hero: { paddingTop: 10, paddingBottom: 22 },
  heroEyebrow: { marginBottom: 10 },
  heroCouple: { marginBottom: 10 },
  heroAmp: {
    fontFamily: 'Inter_500Medium',
  },
  heroRule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.deepGold,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.line,
    marginBottom: 16,
  },
  sectionLabel: { marginBottom: 14 },
  gridRow: { gap: 9 },
  tile: {
    flex: 1,
    height: 100,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
});

