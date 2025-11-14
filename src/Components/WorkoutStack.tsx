import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutInterestScreen from '../Pages/WorkoutInterestScreen';
import WorkoutScreen from '../Pages/WorkoutScreen';
import ExerciseListScreen from '../Pages/ExerciseListScreen';
import WorkoutDetailScreen from '../Pages/WorkoutDetailScreen';
import WorkoutSessionScreen from '../Pages/WorkoutSessionScreen';

const Stack = createNativeStackNavigator();

export default function WorkoutStack() {
  return (
    <Stack.Navigator
      initialRouteName="WorkoutInterestScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="WorkoutInterestScreen" 
        component={WorkoutInterestScreen} 
      />
      <Stack.Screen 
        name="WorkoutScreen" 
        component={WorkoutScreen} 
      />
      <Stack.Screen 
        name="ExerciseList" 
        component={ExerciseListScreen} 
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen} 
      />
      <Stack.Screen 
        name="WorkoutSession" 
        component={WorkoutSessionScreen} 
      />
    </Stack.Navigator>
  );
}
