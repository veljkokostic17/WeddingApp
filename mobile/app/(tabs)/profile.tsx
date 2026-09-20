import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  countdownLabel,
  daysUntil,
  formatWeddingDate,
} from "@/constants/dates";
import { Palette } from "@/constants/paper-theme";
import { Layout, Type } from "@/constants/typography";
import { useAuth } from "@/context/auth-context";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={Type.meta}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  // Same guard as the Home hero: (tabs) can't render logged out, but useAuth
  // still types user as nullable and TS can't infer otherwise.
  if (user == null) return <View style={Layout.screen} />;

  const initials =
    user.yourName.charAt(0) + "&" + user.yourPartnerName.charAt(0);

  return (
    <SafeAreaView style={Layout.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.couple}>
            {user.yourName} <Text style={styles.amp}>&</Text>{" "}
            {user.yourPartnerName}
          </Text>

          <View style={styles.rule} />

          <Text style={Type.eyebrow}>
            {countdownLabel(daysUntil(user.weddingDate))}
          </Text>
        </View>

        <View style={styles.info}>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Vaše ime" value={user.yourName} />
          <InfoRow label="Partner" value={user.yourPartnerName} />
          <InfoRow
            label="Datum venčanja"
            value={formatWeddingDate(user.weddingDate)}
          />

          <Pressable
            style={styles.infoRow}
            onPress={() => router.push("/edit-profile")}
            accessibilityRole="button"
            accessibilityLabel="Uredi profil"
          >
            <Text style={[Type.meta, styles.linkLabel]}>Uredi profil</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Palette.charcoalSoft}
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.logout}
          onPress={() => void logout()}
          accessibilityRole="button"
          accessibilityLabel="Odjavi se"
        >
          <Ionicons name="log-out-outline" size={18} color={Palette.deepGold} />
          <Text style={[Type.button, styles.logoutText]}>Odjavi se</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 24 },

  header: { alignItems: "center", paddingTop: 26, paddingBottom: 26 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.creamDeep,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 20,
    color: Palette.deepGold,
  },
  couple: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Palette.charcoal,
  },
  // Playfair's ampersand is an ornate swash the dev disliked — Inter for the &
  // only, names stay Playfair. Same treatment as the Home hero.
  amp: { fontFamily: "Inter_500Medium" },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 12,
    marginBottom: 12,
  },

  info: { borderTopWidth: 1, borderTopColor: Palette.line },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  linkLabel: { color: Palette.deepGold },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Palette.charcoal,
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Palette.gold,
    paddingVertical: 13,
  },
  logoutText: { color: Palette.deepGold },
});
