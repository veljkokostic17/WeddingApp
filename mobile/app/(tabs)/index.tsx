import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFetch } from "@/hooks/use-fetch";
import { Category } from "@/types/category";
import { Palette, tileGradients } from "@/constants/paper-theme";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";

export default function HomeScreen() {
  const { data: categories, loading, error } = useFetch<Category[]>('/category');

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>
  if (error) return <View style={styles.center}><Text>{error}</Text></View>

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
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
              <Text style={styles.heroEyebrow}>128 dana do velikog dana</Text>
              <Text style={styles.heroCouple}>
                Marija <Text style={styles.heroAmp}>&</Text> Petar
              </Text>
              <View style={styles.heroRule} />
              <Text style={styles.heroDate}>Venčanje · 15. maj 2026.</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Kategorije</Text>
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
            <Text style={styles.tileLabel}>{item.name}</Text>
          </LinearGradient>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.cream },
  grid: { padding: 20, gap: 9 },
  hero: { paddingTop: 10, paddingBottom: 22 },
  heroEyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Palette.deepGold,
    marginBottom: 10,
  },
  heroCouple: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: Palette.charcoal,
    marginBottom: 10,
  },
  heroAmp: {
    fontFamily: 'Inter_500Medium',
  },
  heroRule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.deepGold,
    marginBottom: 12,
  },
  heroDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Palette.charcoalSoft,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.line,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Palette.charcoalSoft,
    marginBottom: 14,
  },
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
  tileLabel: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

