import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/services/api-error";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import { Palette } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  async function handleLogin() {
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
    } catch (e) {
      if (e instanceof ApiError) {
        setError(
          e.status === 401
            ? "Pogrešan email ili lozinka."
            : "Greška na serveru",
        );
      } else {
        setError("Konekcija sa serverom neuspešna, pokušaj ponovo");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !submitting && email.trim() !== "" && password !== "";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        bottomOffset={120}
      >
        <Text style={Type.eyebrow}>VAŠE VENČANJE</Text>
        <Text style={[Type.h1, styles.title]}>Dobrodošli</Text>
        <View style={styles.rule} />
        <Text style={[Type.body, styles.subtitle]}>
          Prijavite se da nastavite planiranje.
        </Text>

        <TextInput
          label={"Email"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          outlineColor={Palette.line}
          style={styles.input}
        />
        <TextInput
          label={"Lozinka"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          mode="outlined"
          outlineColor={Palette.line}
          style={styles.input}
        />

        {error != null && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={submitting}
          disabled={!canSubmit}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={Type.button}
        >
          Prijavi se
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/sign-in/register")}
          textColor={Palette.deepGold}
        >
          Nemate nalog? Registrujte se ovde.
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  body: {
    // flexGrow, not flex — on a contentContainerStyle, flex: 1 pins the content
    // to the screen height and stops it scrolling when the keyboard is up.
    flexGrow: 1,
    // Deliberately NOT justifyContent: "center". Centred content re-centres when
    // the keyboard adds bottom padding, jumping up by half the keyboard height —
    // a fixed paddingTop keeps the resting position stable instead.
    paddingTop: 140,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  title: { marginTop: 10 },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 14,
  },
  subtitle: { marginTop: 14, marginBottom: 26 },
  input: { marginBottom: 12, backgroundColor: "#FFFFFF" },
  // MD3's error red — the brand palette has no error tone of its own.
  error: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#B3261E",
    marginTop: 2,
    marginBottom: 8,
  },
  button: { marginTop: 10, borderRadius: 14 },
  buttonContent: { paddingVertical: 7 },
});
