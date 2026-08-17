import { useFetch } from "@/hooks/use-fetch";
import { Vendor } from "@/types/vendor";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";



export default function VendorScreen() {
    const {id} = useLocalSearchParams<{id: string;}>();

    const {data: vendor, loading, error} = useFetch<Vendor>(id ? "/vendor/" + id : null);

    if (loading) return <View style={styles.center}><ActivityIndicator /></View>
    if (error) return <View style={styles.center}><Text>{error}</Text></View>
}