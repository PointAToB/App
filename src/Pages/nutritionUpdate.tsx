import React, { useState } from "react";
import { View, TextInput, Text, Alert, ScrollView, Pressable } from "react-native";
import { updateNutritionLog, resetNutritionLog } from "../Functions/nutritionApi";
import { useNavigation } from "@react-navigation/native";

export default function NutritionUpdate() {
  const nav = useNavigation<any>();
  const [vals, setVals] = useState<{[k:string]: string}>({});

  const set = (k:string) => (t:string) => setVals(v => ({...v, [k]: t}));

  async function onUpdate() {
    try {
      const payload: any = {};
      ["calories","carbs","protein","fiber","fat"].forEach(k => {
        if (vals[k] !== undefined && vals[k] !== "") payload[k] = Number(vals[k]);
      });
      await updateNutritionLog(payload);
      nav.goBack();
    } catch { Alert.alert("Error", "Failed to update log"); }
  }

  async function onReset() {
    try { await resetNutritionLog(); nav.goBack(); }
    catch { Alert.alert("Error", "Failed to reset"); }
  }

  const Field = ({label,keyName}:{label:string; keyName:string}) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight:"600", marginBottom:6 }}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Add"
        value={vals[keyName] ?? ""}
        onChangeText={set(keyName)}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:12, padding:12 }}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding:20 }}>
      <Text style={{ fontSize:24, fontWeight:"800", marginBottom:12 }}>Update Log</Text>
      <View style={{ backgroundColor:"#fff", borderRadius:16, padding:16, borderWidth:1, borderColor:"#eee" }}>
        <Field label="Calories" keyName="calories" />
        <Field label="Carbohydrates" keyName="carbs" />
        <Field label="Protein" keyName="protein" />
        <Field label="Fibers" keyName="fiber" />
        <Field label="Fats" keyName="fat" />
      </View>

      <Pressable onPress={onUpdate} style={{ marginTop:20, padding:14, borderRadius:24, backgroundColor:"#FF7A00", alignItems:"center" }}>
        <Text style={{ color:"#fff", fontWeight:"700" }}>Update</Text>
      </Pressable>

      <Pressable onPress={onReset} style={{ marginTop:12, padding:12, borderRadius:16, backgroundColor:"#111", alignItems:"center" }}>
        <Text style={{ color:"#fff" }}>Reset for Today</Text>
      </Pressable>
    </ScrollView>
  );
}