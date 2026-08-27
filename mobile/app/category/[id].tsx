import { VendorListItem } from "@/types/vendor";
import { Palette } from "@/constants/paper-theme";
import { Type, Layout } from "@/constants/typography";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { useFetch } from "@/hooks/use-fetch";
import { VendorCard } from "@/components/vendor-card";
import { ErrorView } from "@/components/error-view";

export default function VendorListScreen () {
  const {id, name} = useLocalSearchParams<{ id: string; name: string}>();

  const { data: vendors, loading, error, refetch} = useFetch<VendorListItem[]>(id ? '/vendor/list?categoryId=' + id : null);

  if (loading) return <View style={Layout.center}><ActivityIndicator /></View>
  if (error) return <ErrorView message={error} onRetry={refetch} />


   return (
  <SafeAreaView style={Layout.screen} edges={['top']}>
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Nazad">
          <Ionicons name="chevron-back" size={21} color={Palette.charcoal} />
        </Pressable>
        <Text style={Type.h1}>{name}</Text>
      </View>
      <Text style={[Type.metaSmall, styles.headerSub]}>{vendors?.length ?? 0} u ponudi u Zrenjaninu</Text>
    </View>

    <FlatList
      data={vendors ?? []}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.empty}>Još nema ponuda u ovoj kategoriji.</Text>}
      renderItem={({ item, index }) => (
        <VendorCard vendorListItem={item} index={index} />
      )}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40 },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSub: { marginTop: 4, marginLeft: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  separator: { height: 1, backgroundColor: Palette.line },
  empty: {
  ...Type.meta,
  textAlign: 'center',
  paddingTop: 40,
  paddingHorizontal: 20,
},
});
