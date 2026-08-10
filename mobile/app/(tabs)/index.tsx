import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { apiGet } from "@/services/api";
import { Vendor } from "@/types/vendor";

export default function HomeScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const result = await apiGet<Vendor[]>('/vendor');
        setVendors(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading (false);
      }
    };
    loadVendors();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>
  if (error) return <View style={styles.center}><Text>{error}</Text></View>

  return (
    <FlatList
      data={vendors}
      keyExtractor={(vendor) => vendor.id.toString()}
      renderItem={({item}) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.categoryName}</Text>
        </View>
      )}
  />
 );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 18, color: 'red' },
  category: { color: '#888' },
});

