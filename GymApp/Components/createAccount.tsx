import { StyleSheet, View, Text, TextInput, Dimensions} from "react-native";
import Logo from "./logo.tsx";

import Button from "./button.tsx";
import Agreement from "./agreement.tsx";

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

			<TextInput style={styles.textInput} placeholder='First Name'></TextInput>
			<TextInput style={styles.textInput} placeholder='Last Name'></TextInput>
			<TextInput style={styles.textInput} placeholder='Email'></TextInput>
			<TextInput style={styles.textInput} placeholder='Password'></TextInput>
			<TextInput style={styles.textInput} placeholder='Re-enter Password'></TextInput>

			<Button primaryColor="#DD00FF" secondaryColor="#7650FF" textColor="#FFFFFF" text="Continue" fontSize={15}/>

			<Agreement/>

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
	textInput: {
		paddingHorizontal: 10,
		fontSize: 15,
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10
	}
});

export default Login
