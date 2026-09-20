import { VendorPhoto } from "@/types/vendor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  /** The vendor's full photo list, cover included. */
  photos: VendorPhoto[];
  /** Index to open on; null means closed. */
  openAt: number | null;
  onClose: () => void;
};

const SCREEN = Dimensions.get("window").width;

export function PhotoLightbox({ photos, openAt, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={openAt != null}
      transparent
      animationType="fade"
      // Android's hardware back button closes it; without this it does nothing.
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={openAt ?? 0}
          // initialScrollIndex can't jump without knowing item widths up
          // front — every page is exactly one screen wide.
          getItemLayout={(_data, index) => ({
            length: SCREEN,
            offset: SCREEN * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.page}>
              <Image
                source={{ uri: item.imageUrl }}
                style={StyleSheet.absoluteFill}
                // contain, not cover — the point of opening it is to see the
                // whole photo rather than a crop of it.
                contentFit="contain"
              />
            </View>
          )}
        />

        <Pressable
          style={[styles.close, { top: insets.top + 14 }]}
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Zatvori"
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(20,17,14,0.97)" },
  page: { width: SCREEN, height: "100%" },
  close: {
    position: "absolute",
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
