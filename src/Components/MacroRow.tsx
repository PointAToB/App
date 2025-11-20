import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "./themeToggle";

export default function MacroRow({ label, current, goal, highlight = false }:{
  label: string; current: number; goal: number; highlight?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, goal ? current / goal : 0));
  const { theme } = useTheme();
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ fontWeight: "600", color: highlight ? theme.primaryColor : "#222" }}>{label}</Text>
      <View style={{ height: 8, backgroundColor: "#eee", borderRadius: 8, marginTop: 6 }}>
        <View style={{ width: `${pct*100}%`, height: 8, borderRadius: 8, backgroundColor: theme.primaryColor }} />
      </View>
      <Text style={{ marginTop: 6, color: "#555" }}>
        {current}{label === "Calories" ? "Kcal" : "g"} of {goal}{label === "Calories" ? "Kcal" : "g"}
      </Text>
    </View>
  );
}