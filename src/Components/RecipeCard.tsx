import React from "react";
import { Pressable, View, Text } from "react-native";

export default function RecipeCard({ title, subtitle, onPress }:{
  title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: "#111", borderRadius: 8, padding: 16 }}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>{title}</Text>
      <Text style={{ color: "#bbb", marginTop: 4 }}>{subtitle}</Text>
    </Pressable>
  );
}