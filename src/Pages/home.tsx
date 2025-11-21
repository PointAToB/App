import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../Components/button";
import Camera from "../Components/Camera/camera";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../Components/themeToggle";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchNutritionLog, fetchRecipes } from "../Functions/nutritionApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


const Home = () => {
  const [popupContent, setPopupContent] = useState(false);
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  const primaryColor = theme.primaryColor;
  const secondaryColor = theme.secondaryColor;

  const activeClasses = [
    { id: "1", title: "Morning Yoga", progress: 72 },
    { id: "2", title: "HIIT Workout", progress: 45 },
  ];

  const [nutritionLog, setNutritionLog] = useState<any>(null);
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load both log and recipes
  const loadHomeData = async () => {
    try {
      const [log, recipeList] = await Promise.all([fetchNutritionLog(), fetchRecipes()]);
      setNutritionLog(log);
      setRecipesData(recipeList);
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadHomeData();
  }, []);

  // Refetch whenever Home screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [])
  );

  // Callback to allow Nutrition page to update Home instantly
  const handleUpdateLog = (updatedLog: any) => {
    setNutritionLog(updatedLog);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        {/* Open Camera Button */}
        <Button
          onPress={() => setPopupContent(true)}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          textColor="#FFFFFF"
          text="Open Camera"
          fontSize={15}
          width={150}
        />
        <Camera visible={popupContent} setVisible={setPopupContent} />

        {/* Active Classes */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Active Classes</Text>
          <FlatList
            data={activeClasses.slice(0, 2)}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
            renderItem={({ item }) => (
              <LinearGradient
                colors={[primaryColor, secondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.classBox}
              >
                <Text style={styles.classTitle}>{item.title}</Text>
                <Text style={styles.classProgress}>{item.progress}% Complete</Text>
              </LinearGradient>
            )}
            contentContainerStyle={styles.classList}
          />
          <TouchableOpacity
            style={[styles.seeMoreButton, { backgroundColor: primaryColor }]}
            onPress={() => navigation.navigate("Workouts")}
          >
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>

        {/* Recipes */}
        <View style={[styles.sectionContainer, { marginTop: 40 }]}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Recipes</Text>
          <FlatList
            data={recipesData.slice(0, 2)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.recipeBox]}
                onPress={() =>
                  navigation.navigate("Nutrition", {
                    screen: "Recipe",
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.recipeTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.seeMoreButton, { backgroundColor: "#000" }]}
            onPress={() => navigation.navigate("Nutrition", { screen: "NutritionMain" })}
          >
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Log */}
        <View style={[styles.sectionContainer, { marginTop: 40 }]}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Nutrition Log</Text>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionText}>Calories:</Text>
            <Text style={styles.nutritionNumber}>
              {nutritionLog?.calories?.current ?? 0}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  sectionContainer: {
    marginTop: 40,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  classList: {
    gap: 20,
  },
  classBox: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    height: 110,
    justifyContent: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  classTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  classProgress: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  recipeBox: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    height: 110,
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  recipeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  seeMoreButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  seeMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nutritionCard: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
  },
  nutritionNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
});