import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/services/api-error";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Palette } from "@/constants/paper-theme";
import { Type } from "@/constants/typography";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateForApi, formatDateForDisplay } from "@/constants/dates";

const identityMessages: Record<string, string> = {
  DuplicateUserName: "Nalog sa ovim email-om već postoji.",
  DuplicateEmail: "Nalog sa ovim email-om već postoji.",
  InvalidEmail: "Email adresa nije ispravna.",
  InvalidUserName: "Email adresa nije ispravna.",
  PasswordTooShort: "Lozinka mora imati najmanje 6 karaktera.",
  PasswordRequiresDigit: "Lozinka mora sadržati bar jedan broj.",
  PasswordRequiresLower: "Lozinka mora sadržati bar jedno malo slovo.",
  PasswordRequiresUpper: "Lozinka mora sadržati bar jedno veliko slovo.",
  PasswordRequiresNonAlphanumeric:
    "Lozinka mora sadržati bar jedan specijalni znak (npr. ! ? #).",
  PasswordRequiresUniqueChars:
    "Lozinka mora sadržati više različitih karaktera.",
};

/**
 * AccountController.Register fails in two different shapes: BadRequest(ModelState)
 * returns ProblemDetails { errors: { Field: [msg] } }, while a failed
 * IdentityResult returns a bare [{ code, description }] array.
 */
function messagesFromBody(body: unknown): string[] {
  if (Array.isArray(body)) {
    const mapped = body
      .map((e) => identityMessages[e.code ?? ""])
      .filter((m) => m != null);
    // DuplicateUserName and DuplicateEmail both arrive, and map to one line.
    return [...new Set(mapped)];
  }

  if (body != null && typeof body === "object" && "errors" in body) {
    const fields = (body as { errors: Record<string, string[]> }).errors;
    const messages = [
      fields.Email != null ? "Email adresa nije ispravna." : null,
      fields.Password != null ? "Unesite lozinku." : null,
      fields.YourName != null ? "Unesite vaše ime." : null,
      fields.YourPartnerName != null ? "Unesite ime vašeg partnera." : null,
      fields.WeddingDate != null ? "Izaberite datum venčanja." : null,
    ].filter((m) => m != null);

    return messages.length > 0
      ? messages
      : ["Proverite da su sva polja ispravno popunjena."];
  }

  return [];
}

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [yourName, setYourName] = useState<string>("");
  const [yourPartnerName, setYourPartnerName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { register } = useAuth();

  async function handleRegister() {
    setError(null);
    setSubmitting(true);

    try {
      await register({
        email,
        password,
        yourName,
        yourPartnerName,
        weddingDate: formatDateForApi(weddingDate),
      });
    } catch (e) {
      if (e instanceof ApiError) {
        const messages = messagesFromBody(e.body);
        if (messages.length > 0) {
          setError(messages.join("\n"));
        } else if (e.status >= 500) {
          setError("Greška na serveru. Pokušajte kasnije.");
        } else {
          setError("Registracija nije uspela. Pokušajte ponovo.");
        }
      } else {
        setError("Konekcija sa serverom neuspešna, pokušaj ponovo");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !submitting &&
    email.trim() !== "" &&
    password !== "" &&
    yourName.trim() !== "" &&
    yourPartnerName.trim() !== "";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        bottomOffset={80}
      >
        <Text style={Type.eyebrow}>VAŠE VENČANJE</Text>
        <Text style={[Type.h1, styles.title]}>Kreirajte nalog</Text>
        <View style={styles.rule} />
        <Text style={[Type.body, styles.subtitle]}>
          Nekoliko podataka i možete početi planiranje.
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
          label={"Vaše ime"}
          value={yourName}
          onChangeText={setYourName}
          autoCapitalize="words"
          mode="outlined"
          outlineColor={Palette.line}
          style={styles.input}
        />
        <TextInput
          label={"Ime vašeg partnera"}
          value={yourPartnerName}
          onChangeText={setYourPartnerName}
          autoCapitalize="words"
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
          style={styles.passwordInput}
        />
        <Text style={[Type.metaSmall, styles.hint]}>
          Najmanje 6 karaktera, sa velikim i malim slovom, brojem i specijalnim
          znakom.
        </Text>

        <Text style={[Type.sectionLabel, styles.dateLabel]}>
          DATUM VENČANJA
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowPicker(true)}
          icon={({ size, color }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          )}
          textColor={Palette.deepGold}
          style={styles.dateButton}
          contentStyle={styles.dateButtonContent}
          labelStyle={Type.button}
          accessibilityLabel="Izaberi datum venčanja"
        >
          {formatDateForDisplay(weddingDate)}
        </Button>

        {showPicker && (
          <DateTimePicker
            value={weddingDate}
            mode="date"
            minimumDate={new Date()}
            onChange={(_event, selected) => {
              setShowPicker(false);
              if (selected != null) setWeddingDate(selected);
            }}
          />
        )}

        {error != null && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={submitting}
          disabled={!canSubmit}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={Type.button}
        >
          Registruj se
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          textColor={Palette.deepGold}
        >
          Već imate nalog? Prijavite se.
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.cream },
  body: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
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
  passwordInput: { backgroundColor: "#FFFFFF" },
  hint: { marginTop: 6, marginBottom: 20, lineHeight: 18 },
  dateLabel: { marginBottom: 8 },
  dateButton: { borderRadius: 14, borderColor: Palette.line },
  dateButtonContent: { paddingVertical: 7, justifyContent: "flex-start" },
  // MD3's error red — the brand palette has no error tone of its own.
  error: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#B3261E",
    marginTop: 14,
  },
  button: { marginTop: 20, borderRadius: 14 },
  buttonContent: { paddingVertical: 7 },
});
