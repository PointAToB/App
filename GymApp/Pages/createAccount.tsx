import { StyleSheet, View, Text, Dimensions} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

import Logo from "../Components/logo.tsx";
import Button from "../Components/button.tsx";
import Agreement from "../Components/agreement.tsx";
import PasswordInput from "../Components/PasswordInput.tsx";
import TextInput from "../Components/TextInput.tsx";

import CreateAccount from "../Functions/createAccount.ts";

const Login = (props: {navigation: StackNavigationProp<any>}) => {
	const windowHeight: number = Dimensions.get('window').height;

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		setSubmitted(true);

		if (!CreateAccount(firstName, lastName, email, password)) return;
		props.navigation.push('Home')

		setSubmitted(false);
	}

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>
			<View style={{paddingTop: windowHeight / 10}}/>

			<View style={styles.header}>
				<Text style={[styles.text, {fontWeight: 'bold'}]} >Create an Account</Text>
				<Text style={[styles.text, {fontWeight: 'thin'}]} >You are one step closer to greatness</Text>
			</View>

			<TextInput value={firstName} onChangeText={setFirstName} placeholder='First Name' submitted={submitted}/>
			<TextInput value={firstName} onChangeText={setLastName} placeholder='Last Name' submitted={submitted}/>
			<TextInput value={firstName} onChangeText={setEmail} placeholder='Email' submitted={submitted}/>
			<PasswordInput password={password} setPassword={setPassword} submitted={submitted}/>

			<Button onPress={handleSubmit} primaryColor="#DD00FF" secondaryColor="#7650FF" textColor="#FFFFFF" text="Continue" fontSize={15}/>

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
	}
});

export default Login
