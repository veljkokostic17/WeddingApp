import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  formatDateForApi,
  formatDateForDisplay,
  parseIsoDate,
} from "@/constants/dates";
import { Palette } from "@/constants/paper-theme";
import { Layout, Type } from "@/constants/typography";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/services/api-error";

export default function EditProfile() {
  const { user, updateProfile } = useAuth();

  const [yourName, setYourName] = useState(user?.yourName ?? "");
  const [yourPartnerName, setYourPartnerName] = useState(
    user?.yourPartnerName ?? "",
  );

  const [weddingDate, setWeddingDate] = useState(() =>
    user != null ? parseIsoDate(user.weddingDate) : new Date(),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    setError(null);
    setSubmitting(true);

    try {
      await updateProfile({
        yourName,
        yourPartnerName,
        weddingDate: formatDateForApi(weddingDate),
      });
      router.back();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(
          e.status >= 500
            ? "Greška na serveru. Pokušajte kasnije."
            : "Čuvanje nije uspelo. Proverite podatke.",
        );
      } else {
        setError("Konekcija sa serverom neuspešna, pokušaj ponovo");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !submitting && yourName.trim() !== "" && yourPartnerName.trim() !== "";

  return (
    <SafeAreaView style={Layout.screen} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        bottomOffset={80}
      >
        <Text style={Type.h1}>Uredi profil</Text>
        <View style={styles.rule} />

        <TextInput
          label="Vaše ime"
          value={yourName}
          onChangeText={setYourName}
          autoCapitalize="words"
          mode="outlined"
          outlineColor={Palette.line}
          style={styles.input}
        />
        <TextInput
          label="Ime vašeg partnera"
          value={yourPartnerName}
          onChangeText={setYourPartnerName}
          autoCapitalize="words"
          mode="outlined"
          outlineColor={Palette.line}
          style={styles.input}
        />

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
            onChange={(_event, selected) => {
              setShowPicker(false);
              if (selected != null) setWeddingDate(selected);
            }}
          />
        )}

        <Text style={[Type.metaSmall, styles.hint]}>
          Email adresu nije moguće promeniti.
        </Text>

        {error != null && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={submitting}
          disabled={!canSubmit}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={Type.button}
        >
          Sačuvaj
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          textColor={Palette.deepGold}
          disabled={submitting}
        >
          Otkaži
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },
  rule: {
    width: 34,
    height: 1,
    backgroundColor: Palette.gold,
    marginTop: 12,
    marginBottom: 24,
  },
  input: { marginBottom: 12, backgroundColor: "#FFFFFF" },
  dateLabel: { marginTop: 8, marginBottom: 8 },
  dateButton: { borderRadius: 14, borderColor: Palette.line },
  dateButtonContent: { paddingVertical: 7, justifyContent: "flex-start" },
  hint: { marginTop: 14 },
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
