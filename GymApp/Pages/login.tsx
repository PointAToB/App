import { StyleSheet, View, Text, Dimensions} from "react-native";
import LineWithText from "../Components/lineWithText.tsx";
import Logo from "../Components/logo.tsx";
import Notice from "../Components/notice.tsx";
import Button from "../Components/button.tsx";
import {StackNavigationProp} from "@react-navigation/stack";
import TextInput from "../Components/textInput.tsx";
import {useState} from "react";

const Login = (props: {navigation: StackNavigationProp<any>}) => {
	const windowHeight: number = Dimensions.get('window').height;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitted, isSubmitted] = useState(false);

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>
			<View style={{paddingTop: windowHeight / 10}}/>

			<View style={styles.header}>
				<Text style={[styles.text, {fontWeight: 'bold'}]} >Login</Text>
				<Text style={[styles.text, {fontWeight: 'thin'}]} >Enter your credentials to stay on track</Text>
			</View>

			<TextInput value={email} onChangeText={setEmail} placeholder='Email' submitted={submitted}/>
			<TextInput value={password} onChangeText={setPassword} placeholder='Password' submitted={submitted} hideText={true}/>

			<Button onPress={()=>{props.navigation.push('Home')}} primaryColor='#DD00FF' secondaryColor='#7650FF' textColor='#FFFFFF' text='Login' fontSize={15}/>

			<Notice/>

			<LineWithText text='or'/>

			<Button onPress={()=>{props.navigation.push('Create Account')}} primaryColor='#000000' textColor='#FFFFFF' text='Create an account' fontSize={15} width={200}/>

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
	}
});

export default Login
