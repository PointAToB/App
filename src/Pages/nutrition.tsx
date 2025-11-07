import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import MacroRow from "../Components/MacroRow";
import RecipeCard from "../Components/RecipeCard";
import { fetchNutritionLog, fetchRecipes } from "../Functions/nutritionApi";
import { useNavigation } from "@react-navigation/native";

export default function Nutrition() {
  const nav = useNavigation<any>();
  const [log, setLog] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Nutrition component rendered");

  async function load() {
    console.log("LOAD called");
    try {
      console.log("About to fetch nutrition endpoints");
      const [l, r] = await Promise.all([fetchNutritionLog(), fetchRecipes()]);
      setLog(l);
      setRecipes(r);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const unsub = nav.addListener('focus', load);
    return unsub;
  }, [nav]);

  if (loading || !log) return <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}><ActivityIndicator/></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 12 }}>Nutrition Log</Text>

      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#eee" }}>
        <MacroRow label="Calories"    current={log.calories.current} goal={log.calories.goal} />
        <MacroRow label="Carbohydrates" current={log.carbs.current} goal={log.carbs.goal} />
        <MacroRow label="Protein"     current={log.protein.current} goal={log.protein.goal} highlight />
        <MacroRow label="Fibers"      current={log.fiber.current} goal={log.fiber.goal} />
        <MacroRow label="Fats"        current={log.fat.current} goal={log.fat.goal} />
      </View>

      <Pressable
        onPress={() => nav.getParent()?.navigate('NutritionUpdate')}
        style={{ alignSelf:"center", marginTop: 16, paddingVertical:12, paddingHorizontal:24, borderRadius:24,
                 backgroundColor:"#FF7A00" }}
      >
        <Text style={{ color:"#fff", fontWeight:"700" }}>+</Text>
      </Pressable>

      <Text style={{ marginTop: 24, marginBottom: 12, fontWeight: "700" }}>Recipes We Recommend</Text>
      {recipes[0] && (
        <RecipeCard
          title={recipes[0].title}
          subtitle={recipes[0].subtitle}
          onPress={() => nav.getParent()?.navigate('Recipe', { id: recipes[0].id })}
        />
      )}
    </ScrollView>
  );
}