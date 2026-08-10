import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiGet } from "@/services/api";
import { Category } from "@/types/category";
import { Palette } from "@/constants/paper-theme";
import { LinearGradient } from 'expo-linear-gradient';

const tileGradients = [
  ['#EBC0B6', '#F5E9DC'], // blush rose
  ['#C98B82', '#EAD0C6'], // dusty rose (was charcoal — deeper, but still pink)
  ['#E1C598', '#F5ECD9'], // soft champagne
  ['#EAC7C2', '#F7EFE6'], // light pink
  ['#F3EAD9', '#E1C598'], // pale champagne
] as const;

export default function HomeScreen() {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await apiGet<Category[]>('/category');
        setCategory(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading (false);
      }
    };
    loadCategories();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>
  if (error) return <View style={styles.center}><Text>{error}</Text></View>

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={category}
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
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.cream },
  grid: { padding: 20, gap: 7 },
  hero: { paddingTop: 8, paddingBottom: 16 },
  heroEyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Palette.deepGold,
    marginBottom: 8,
  },
  heroCouple: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Palette.charcoal,
    marginBottom: 8,
  },
  heroAmp: {
    fontFamily: 'Inter_500Medium',
  },
  heroRule: {
    width: 28,
    height: 1,
    backgroundColor: Palette.deepGold,
    marginBottom: 8,
  },
  heroDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Palette.charcoalSoft,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.line,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Palette.charcoalSoft,
    marginBottom: 10,
  },
  gridRow: { gap: 7 },
  tile: {
    flex: 1,
    height: 84,
    borderRadius: 12,
    padding: 9,
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
    fontSize: 13,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

