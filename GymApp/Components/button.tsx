import {Pressable, Text, StyleSheet} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Button = (props: {primaryColor: string, secondaryColor?: string, textColor: string, text: string, fontSize: number, width?: number}) => {
	const secondaryColor:string = !props.secondaryColor ? props.primaryColor : props.secondaryColor;
	return (
		<Pressable style={[styles.container, (props.width === undefined ? null : {width: props.width, alignSelf: 'center'})]}>
				<LinearGradient
					style={styles.button}
					colors={[props.primaryColor, secondaryColor]}
					start={{ x: 0, y: 0.5 }}
        	end={{ x: 1, y: 0.5 }}
				>
					<Text style={[styles.text, {color: props.textColor, fontSize: props.fontSize}]}>{props.text}</Text>
				</LinearGradient>
			</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10,
		overflow: 'hidden'
	},
	text: {
		textAlign: 'center',
		justifyContent: 'center'
	},
	button: {
		padding: 10
	}
})

export default Button;