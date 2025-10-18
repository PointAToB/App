import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Pages/home'; 
import Classes from '../Pages/classes';
import Nutrition from '../Pages/nutrition';
import FAQ from '../Pages/faq';
import Profile from '../Pages/profile';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } 
		  else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } 
		  else if(route.name === 'Classes') {
			iconName = focused ? 'man' : 'man';
		  }
		  else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition';
          }
		  else if(route.name === 'FAQ') {
			iconName = focused ? 'help-circle' : 'help-circle-outline';
		  }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Classes" component={Classes} />
			<Tab.Screen name="Nutrition" component={Nutrition} />
			<Tab.Screen name="FAQ" component={FAQ} />

    </Tab.Navigator>
  );
}