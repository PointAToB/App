import { StyleSheet, View, Text, TextInput, Pressable, Linking, Dimensions} from "react-native";
import LineWithText from "./lineWithText.tsx";
import LinearGradient from "react-native-linear-gradient";
import Logo from "./logo.tsx";
import Agreement from "./agreement.tsx";
import Button from "./button.tsx";

const Login = () => {
	const windowHeight: number = Dimensions.get('window').height;
	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>
			<View style={{paddingTop: windowHeight / 10}}/>

			<View style={styles.header}>
				<Text style={[styles.text, {fontWeight: 'bold'}]} >Login</Text>
				<Text style={[styles.text, {fontWeight: 'thin'}]} >Enter your credentials to stay on track</Text>
			</View>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Email'></TextInput>
			<TextInput style={[styles.textBase, styles.textInput]} placeholder='Password'></TextInput>

			<Button primaryColor='#DD00FF' secondaryColor='#7650FF' textColor='#FFFFFF' text='Create an account' fontSize={15}/>

			<Agreement/>

			<LineWithText text='or'/>

			<Button primaryColor='#000000' textColor='#FFFFFF' text='Create an account' fontSize={15} width={200}/>

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
