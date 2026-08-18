import { Vendor } from "@/types/vendor";
import { Palette } from "@/constants/paper-theme";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { useFetch } from "@/hooks/use-fetch";
import { VendorCard } from "@/components/vendor-card";

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
        <VendorCard vendor={item} index={index} />
      )}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.cream },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
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
    fontSize: 24,
    color: Palette.charcoal,
  },
  headerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Palette.charcoalSoft,
    marginTop: 4,
    marginLeft: 40,
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  separator: { height: 1, backgroundColor: Palette.line },
});
