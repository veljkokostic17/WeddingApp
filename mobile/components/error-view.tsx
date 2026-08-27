import { Palette } from "@/constants/paper-theme";
import { Layout, Type } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  /** Already-translated message from useFetch. */
  message: string;
  /** useFetch's refetch — re-runs the request. */
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: Props) {
  return (
    <View style={Layout.center}>
      <Text style={[Type.body, styles.message]}>{message}</Text>

      <Pressable
        style={styles.btn}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Pokušaj ponovo"
      >
        <Ionicons name="refresh" size={17} color="#FFFFFF" />
        <Text style={[Type.button, styles.btnText]}>Pokušaj ponovo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 18,
  },
  // Matches the vendor screen's solid contact button, minus flex:1 —
  // this one is centered on its own, not sharing a row.
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
    backgroundColor: Palette.gold,
  },
  btnText: { color: "#FFFFFF" },
});
