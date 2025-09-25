import {Text, View, StyleSheet} from 'react-native'

const Logo = (props: {primaryColor: string, secondaryColor?: string, scale?: number}) => {
	let color: string | undefined = !props.secondaryColor ? props.primaryColor : props.secondaryColor;
	let scale: number | undefined = !props.scale ? 1 : props.scale;

	return (
		<Text style={[styles.main, {height: (scale * 40)}]}>
			<Text style={[styles.primaryText, {color: props.primaryColor, fontSize: (scale * 30)}]}>Fit </Text>
			<View>
				<Text style={[styles.secondaryText, {color: color, height: (scale * 28), fontSize: (scale * 25)}]}>A2B</Text>
			</View>
		</Text>
	);
}

const styles = StyleSheet.create({
	main: {
		textAlign: 'center',
		justifyContent: 'center',
	},
	primaryText: {
		fontStyle: 'italic',
		fontWeight: 'bold'
	},
	secondaryText: {
		fontWeight: 'thin'
	}
});



export default Logo;