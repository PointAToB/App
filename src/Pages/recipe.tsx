import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { fetchRecipe } from "../Functions/nutritionApi";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../Components/themeToggle";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recipe() {
  const nav = useNavigation<any>();
  const { params } = useRoute<any>();
  const { id } = params as { id: number };
  const [recipe, setRecipe] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => { fetchRecipe(id).then(setRecipe); }, [id]);

  if (!recipe) return <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}><ActivityIndicator/></View>;

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: theme.background }}> 
        <ScrollView contentContainerStyle={{ padding:20 }}>
          <Text style={{ color: theme.primaryColor, fontWeight:"800", marginBottom:6 }}>Breakfast</Text>
          <Text style={{ fontSize:28, fontWeight:"900" }}>{recipe.title}</Text>
          <Text style={{ fontWeight:"700", marginTop:12 }}>{recipe.subtitle}</Text>

          <Text style={{ fontWeight:"800", marginTop:20 }}>Ingredients:</Text>
            {recipe.ingredients.map((it:string, i:number) => (
            <Text key={i} style={{ marginTop:4 }}>• {it}</Text>
          ))}

          <Text style={{ fontWeight:"800", marginTop:20 }}>Steps:</Text>
            {recipe.steps.map((s:string, i:number) => (
           <Text key={i} style={{ marginTop:6 }}>{i+1}. {s}</Text>
          ))}

          <Pressable onPress={() => nav.goBack()} style={{ marginTop:24, padding:14, borderRadius:24, backgroundColor: theme.primaryColor, alignItems:"center" }}>
            <Text style={{ color:"#fff", fontWeight:"700" }}>Done</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}