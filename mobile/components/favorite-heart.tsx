import { Palette } from "@/constants/paper-theme";
import { useFavorites } from "@/context/favorites-context";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, ViewStyle } from "react-native";

type Props = {
  vendorId: number;
  vendorName: string;
  size: number;
  style: StyleProp<ViewStyle>;
};

export function FavoriteHeart({ vendorId, vendorName, size, style }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(vendorId);

  return (
    <Pressable
      style={style}
      hitSlop={8}
      onPress={() => void toggleFavorite(vendorId).catch(() => {})}
      accessibilityRole="button"
      accessibilityState={{ selected: favorited }}
      accessibilityLabel={
        favorited
          ? "Ukloni " + vendorName + " iz omiljenih"
          : "Sačuvaj " + vendorName + " u omiljene"
      }
    >
      <Ionicons
        name={favorited ? "heart" : "heart-outline"}
        size={size}
        color={Palette.deepGold}
      />
    </Pressable>
  );
}
