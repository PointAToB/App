import React, { use } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Pages/home'; 
import Classes from '../Pages/classes';
import Nutrition from '../Pages/nutrition';
import FAQ from '../Pages/faq';
import Profile from '../Pages/profile';
import { useTheme } from './themeToggle';
import WorkoutStack from '../Components/WorkoutStack';

const Tab = createBottomTabNavigator();

export default function Navigation() {
	const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
		tabBarStyle: {
			backgroundColor: theme.nav
		},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } 
		  else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
		  else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition';
          }
		  else if(route.name === 'FAQ') {
			iconName = focused ? 'help-circle' : 'help-circle-outline';
		  }
		  else if(route.name === 'Workouts') {
			iconName = focused ? 'fitness' : 'fitness-outline';
		  }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Classes" component={Classes} />
      <Tab.Screen name="Nutrition" component={Nutrition} />
	  	<Tab.Screen name="Profile" component={Profile} />
			<Tab.Screen name="FAQ" component={FAQ} />


    </Tab.Navigator>
  );
}