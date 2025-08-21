import {
  StatusBar,
  StyleSheet,
  useColorScheme,
	View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Login from "./Components/login.tsx";


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        hidden={false}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

			<View>
				<Login/>
			</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
		justifyContent: 'center'
  },
	input: {
		borderStyle: "solid",
		borderColor: "#828282",
		borderRadius: 5
	}
});

export default App;