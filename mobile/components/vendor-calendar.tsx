import { Palette } from "@/constants/paper-theme";
import { VendorUnavailableDate } from "@/types/vendor";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";


type Props = {
  unavailableDates: VendorUnavailableDate[];
};

const TODAY = new Date();
const months_ahead = 35;
const months = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

export function VendorCalendar({ unavailableDates }: Props) {
  const [offset, setOffset] = useState(0);

  const busy = new Set(unavailableDates.map((d) => d.date));
  const shown = new Date(TODAY.getFullYear(), TODAY.getMonth() + offset, 1);

  const year = shown.getFullYear();
  const month = shown.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (shown.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={styles.calWrap}>
      <View style={styles.calHead}>
        <Text style={styles.calLabel}>
          Dostupnost · {months[month]} {year}
        </Text>

        <View style={styles.calNav}>
          <Pressable
            style={[styles.calNavBtn, offset === 0 && styles.calNavBtnOff]}
            disabled={offset === 0}
            onPress={() => setOffset((o) => o - 1)}
            hitSlop={6}
          >
            <Ionicons name="chevron-back" size={17} color={Palette.charcoalSoft} />
          </Pressable>

          <Pressable
            style={[styles.calNavBtn, offset === months_ahead && styles.calNavBtnOff]}
            disabled={offset === months_ahead}
            onPress={() => setOffset((o) => o + 1)}
            hitSlop={6}
            >
              <Ionicons name="chevron-forward" size={17} color={Palette.charcoalSoft} />
            </Pressable>
        </View>
      </View>

      <View style={styles.calWeek}>
        {["P", "U", "S", "Č", "P", "S", "N"].map((d, i) => (
          <Text key={i} style={styles.calWeekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.calGrid}>
        {cells.map((day, i) => {
          // blanks before the 1st — an invisible box that just holds the column
          if (day === null)
            return (
              <View key={i} style={[styles.calCell, styles.calCellEmpty]} />
            );

          // same shape the backend sends: "2026-08-03"
          const dayKey =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");
          const isBusy = busy.has(dayKey);

          return (
            <View
              key={i}
              style={[styles.calCell, isBusy && styles.calCellBusy]}
            >
              <Text style={[styles.calDay, isBusy && styles.calDayBusy]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.calLegend}>
        <View style={styles.calDot} />
        <Text style={styles.calLegendText}>Zauzeto</Text>
      </View>
    </View>
  );
}

// 7 columns: screen width, minus the parent's 20px padding each side,
// minus the six 4px gaps between cells.
const CELL = Math.floor((Dimensions.get("window").width - 40 - 24) / 7);

const styles = StyleSheet.create({
  calWrap: { marginBottom: 16 },
  calHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: Palette.charcoalSoft,
  },
  calNav: { flexDirection: "row", gap: 6 },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.creamDeep,
  },
  calNavBtnOff: { opacity: 0.35 },

  calWeek: { flexDirection: "row", gap: 4, marginBottom: 5 },
  calWeekday: {
    width: CELL,
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 10.5,
    letterSpacing: 0.5,
    color: Palette.charcoalSoft,
  },

  calGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  calCell: {
    width: CELL,
    height: CELL,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.creamDeep,
  },
  calCellEmpty: { backgroundColor: "transparent" },
  calCellBusy: { backgroundColor: Palette.blushDeep },
  calDay: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Palette.charcoalSoft,
  },
  calDayBusy: { fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },

  calLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 9,
  },
  calDot: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: Palette.blushDeep,
  },
  calLegendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    color: Palette.charcoalSoft,
  },
});
