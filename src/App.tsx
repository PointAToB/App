import {StatusBar, useColorScheme} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from "@react-navigation/native";

import Login from "./Pages/login";
import CreateAccount from "./Pages/createAccount";
import Home from "./Pages/home";
import Navigation from "./Components/navigation";
import WorkoutDetailScreen from "./Pages/WorkoutDetailScreen";
import WorkoutInterestScreen from "./Pages/WorkoutInterestScreen";


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();

  return (
		<NavigationContainer>
    <SafeAreaView>
      <StatusBar
        translucent={true}
        hidden={false}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
			</SafeAreaView>
				<Stack.Navigator initialRouteName='Login'>
					<Stack.Screen options={{headerShown: false}} name='Login' component={Login}/>
					<Stack.Screen name='Create Account' component={CreateAccount}/>
          <Stack.Screen 
            options={{ headerShown: false }} 
            name='WorkoutInterests' 
            component={WorkoutInterestScreen} 
          />
          <Stack.Screen options={{ headerShown: false }} name='Home' component={Navigation} />
          <Stack.Screen
            options={{ headerShown: false }}
            name='WorkoutDetail'
            component={WorkoutDetailScreen}
          />
          <Stack.Screen options={{ headerShown: false }} name='Main' component={Navigation} />
				</Stack.Navigator>
			</NavigationContainer>
  );
}



export default App;