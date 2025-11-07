<<<<<<< HEAD
import { View } from "react-native";
import {useState} from "react";
import { OpenCamera } from "./camera";

=======
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../Components/button";
import Camera from "../Components/Camera/camera";
import { useNavigation } from "@react-navigation/native";
>>>>>>> origin/main

const Home = () => {
  const [popupContent, setPopupContent] = useState(false);
  const navigation = useNavigation<any>();

  // Theme colors
  const primaryColor = "#DD00FF";
  const secondaryColor = "#7650FF";

  // Placeholder data
  const activeClasses = [
    { id: "1", title: "Morning Yoga", progress: 72 },
    { id: "2", title: "HIIT Workout", progress: 45 },
  ];

  const recipes = [
    { id: "1", title: "Protein Pancakes" },
    { id: "2", title: "Avocado Smoothie" },
  ];

  const calories = 1825; // placeholder value

  return (
<<<<<<< HEAD
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <OpenCamera/>
=======
    <View style={styles.container}>
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

      {/* Active Classes Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Active Classes</Text>

        <FlatList
          data={activeClasses.slice(0, 2)}
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
          onPress={() => navigation.navigate("Classes")}
        >
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>

      {/* Recipes Section */}
      <View style={[styles.sectionContainer, { marginTop: 40 }]}>
        <Text style={styles.sectionHeader}>Recipes</Text>

        <FlatList
          data={recipes.slice(0, 2)}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.recipeBox]}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </View>
          )}
          contentContainerStyle={styles.classList}
        />

        <TouchableOpacity
          style={[styles.seeMoreButton, { backgroundColor: "#000" }]}
          onPress={() => navigation.navigate("Nutrition")}
        >
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Log Section */}
      <View style={[styles.sectionContainer, { marginTop: 40 }]}>
        <Text style={styles.sectionHeader}>Nutrition Log</Text>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionText}>Calories:</Text>
          <Text style={styles.nutritionNumber}>{calories}</Text>
        </View>
      </View>
>>>>>>> origin/main
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  sectionContainer: {
    marginTop: 40,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
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