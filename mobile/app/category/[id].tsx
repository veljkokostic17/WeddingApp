import { Vendor } from "@/types/vendor";
import { Palette, tileGradients } from "@/constants/paper-theme";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons'
import { useFetch } from "@/hooks/use-fetch";

export default function VendorListScreen () {
  const {id, name} = useLocalSearchParams<{ id: string; name: string}>();

  const { data: vendors, loading, error} = useFetch<Vendor[]>(id ? '/vendor?categoryId=' + id : null);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>
  if (error) return <View style={styles.center}><Text>{error}</Text></View>


   return (
  <SafeAreaView style={styles.screen} edges={['top']}>
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={21} color={Palette.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <Text style={styles.headerSub}>{vendors?.length ?? 0} objekata u Zrenjaninu</Text>
    </View>

    <FlatList
      data={vendors ?? []}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => router.push({pathname: '/vendor/[id]', params: {id: item.id}})}>
        <View style={styles.card}>
          <View style={styles.photo}>
            {item.photos.length > 0 ? (
              <Image source={{ uri: item.photos[0].imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={tileGradients[index % tileGradients.length]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}

            <LinearGradient
              colors={['transparent', 'rgba(54,47,39,0.6)']}
              style={styles.photoScrim}
            />

            {/* Visual-only for now — favorite toggle needs auth (wired up with login later) */}
            <Pressable style={styles.heartBtn} hitSlop={8}>
              <Ionicons name="heart-outline" size={15} color={Palette.deepGold} />
            </Pressable>

            <Text style={styles.vName} numberOfLines={1}>{item.name}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.vAddr} numberOfLines={1}>{item.address}</Text>
            {item.capacity != null && (
              <Text style={styles.vCap}>Do {item.capacity} gostiju</Text>
            )}
          </View>
        </View>
      </Pressable>
      )}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.cream },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40 },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 21,
    color: Palette.charcoal,
  },
  headerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    color: Palette.charcoalSoft,
    marginTop: 2,
    marginLeft: 40,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  separator: { height: 1, backgroundColor: Palette.line },
  card: { paddingVertical: 10 },
  photo: {
    height: 104,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  photoScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vName: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 6,
  },
  vAddr: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Palette.charcoalSoft,
  },
  vCap: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Palette.deepGold,
  },
});
