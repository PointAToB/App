import { StyleSheet, View, Text, TextInput, Pressable, Dimensions} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Logo from "./logo.tsx";

const Login = () => {
	const windowHeight: number = Dimensions.get('window').height;
	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>
			<View style={{paddingTop: windowHeight / 10}}/>

			<View style={styles.header}>
				<Text style={[styles.text, {fontWeight: 'bold'}]} >Create an Account</Text>
				<Text style={[styles.text, {fontWeight: 'thin'}]} >You are one step closer to greatness</Text>
			</View>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='First Name'></TextInput>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Last Name'></TextInput>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Email'></TextInput>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Password'></TextInput>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Re-enter Password'></TextInput>

			<Pressable style={[styles.textBase, {overflow: 'hidden'}]}>
				<LinearGradient
					style={styles.button}
					colors={["#DD00FF", "#7650FF"]}
					start={{ x: 0, y: 0.5 }}
        	end={{ x: 1, y: 0.5 }}
				>
					<Text style={[styles.text, {color: '#FFFFFF'}]}>Continue</Text>
				</LinearGradient>
			</Pressable>

			<Text style={styles.agreement}>
				<Text>By clicking continue, you agree to our </Text>
				<Text style={{fontWeight: 'bold', fontSize: 12}} >Terms of Service</Text>
				<Text> and </Text>
				<Text style={{fontWeight: 'bold', fontSize: 12}} >Privacy Policy</Text>
			</Text>
			<View style={{paddingTop: windowHeight / 5}}/>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		margin: 25,
	},
	header: {
		marginBottom: 15
	},
	text: {
		fontSize: 15,
		textAlign: 'center',
		color: '#000000'
	},
	textBase: {
		fontSize: 15,
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10
	},
	textInput: {
		paddingHorizontal: 10,
	},
	button: {
		padding: 10
	},
	agreement: {
		fontSize: 10,
		marginTop: 15,
		marginLeft: -5,
		marginRight: -5
	}
});

export default Login
