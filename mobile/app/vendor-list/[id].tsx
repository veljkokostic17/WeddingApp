import { apiGet } from "@/services/api";
import { Vendor } from "@/types/vendor";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";



export default function VendorListScreen () {
    const [vendor, setVendor] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const {id, name} = useLocalSearchParams<{ id: string; name: string}>();

    useEffect (() => {
        const loadVendors = async () => {

            try {
                const result = await apiGet<Vendor[]>('/vendor?categoryId=' + id);
                setVendor(result);
            } catch (e: any) {
                setError (e.message);
            } finally {
                setLoading (false)
            }
        };
        loadVendors();
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator /></View>
    if (error) return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{error}</Text></View>


   return (
  <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 20, marginBottom: 12 }}>{name}</Text>
    <FlatList
      data={vendor}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text style={{ paddingVertical: 6 }}>{item.name}</Text>}
    />
  </View>
);
}