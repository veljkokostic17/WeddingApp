import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

import { Palette } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { useAuth } from "@/context/auth-context";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <Text style={Type.h1}>Profil</Text>
        <View style={styles.rule} />

        {user != null && (
          <>
            <Text style={[Type.body, styles.name]}>
              {user.yourName} & {user.yourPartnerName}
            </Text>
            <Text style={Type.metaSmall}>{user.email}</Text>
          </>
        )}

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={Type.button}
          textColor={Palette.deepGold}
        >
          Odjavi se
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 12,
    marginBottom: 20,
  },
  name: { marginBottom: 2 },
  button: {
    marginTop: 26,
    borderRadius: 14,
    borderColor: Palette.gold,
  },
  buttonContent: { paddingVertical: 7 },
});
