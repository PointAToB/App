import { View, StyleSheet } from "react-native";
//import Octicons from 'react-native-vector-icons/Octicons';
import {Icon} from "react-native-vector-icons/Icon";

const Navigation = () => {
	return(
		<View style={styles.container}>
			<View style={styles.main}>

			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFFFFF'
	},
	main: {
		backgroundColor: '#000000',
		height: 75,
		borderTopRightRadius: 25,
		borderTopLeftRadius: 25
	}
});

export default Navigation;