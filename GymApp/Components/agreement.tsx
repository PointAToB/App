import { Text, StyleSheet, Pressable, View } from "react-native";


const Agreement = () => {
	return(
		<View style={styles.agreement} >
				<Text style={styles.text} >By clicking continue, you agree to our </Text>
				<Pressable>
					<Text style={styles.bold} >Terms of Service</Text>
				</Pressable >
				<Text style={styles.text} > and </Text>
				<Pressable>
					<Text style={styles.bold} >Privacy Policy</Text>
				</Pressable>
			</View>
	);
}

const styles = StyleSheet.create({
	agreement: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
		marginLeft: -5,
		marginRight: -5,
	},
	text: {
		fontSize: 10,
	},
	bold: {
		fontWeight: 'bold',
		fontSize: 12,
		lineHeight: 12,
		overflow: 'scroll'
	}
});

export default Agreement;