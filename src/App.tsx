import {StatusBar, useColorScheme} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from "@react-navigation/native";

import Login from "./Pages/login";
import CreateAccount from "./Pages/createAccount";
import Navigation from "./Components/navigation";
import { Camera } from "./Pages/camera"

import { TestHome } from './Components/testHome';

function App() {
  const isDarkMode = false //useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <SafeAreaView>
            <StatusBar translucent={true} hidden={false} barStyle={'dark-content'}/>
		</SafeAreaView>
	    <Stack.Navigator initialRouteName='TestHome'>
		    <Stack.Screen options={{headerShown: false}} name='TestHome' component={TestHome}/>
			<Stack.Screen options={{headerShown: false}} name='Camera' component={Camera}/>
		</Stack.Navigator>
	</NavigationContainer>
  );
}

export default App;