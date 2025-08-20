import {Text, View, StyleSheet} from 'react-native'

const Logo = (props: {primaryColor: string, secondaryColor?: string}) => {
	let color: string | undefined = props.secondaryColor;
	if (!props.secondaryColor) { color = props.primaryColor}
	return (
		<Text style={styles.main}>
			<Text style={[styles.primaryText, {color: props.primaryColor}]}>Fit </Text>
			<View>
				<Text style={[styles.secondaryText, {color: color}]}>A2B</Text>
			</View>
		</Text>
	);
}

const styles = StyleSheet.create({
	main: {
		textAlign: 'center',
		justifyContent: 'center',
		height: 40
	},
	primaryText: {
		fontStyle: 'italic',
		fontSize: 30,
		fontWeight: 'bold'
	},
	secondaryText: {
		height: 28,
		fontSize: 25,
		fontWeight: 'thin'
	}
});



export default Logo;