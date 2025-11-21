import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Nutrition from '../Pages/nutrition';
import NutritionUpdate from '../Pages/nutritionUpdate';
import Recipe from '../Pages/recipe'; // optional, if it's also part of the nutrition flow

const Stack = createNativeStackNavigator();

export default function NutritionStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="NutritionMain"
    >
      <Stack.Screen name="NutritionMain" component={Nutrition} />
      <Stack.Screen name="NutritionUpdate" component={NutritionUpdate} />
      <Stack.Screen name="Recipe" component={Recipe} />  
    </Stack.Navigator>
  );
}