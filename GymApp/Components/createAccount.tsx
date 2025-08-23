import { StyleSheet, View, Text, TextInput, Dimensions} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

import Logo from "./logo.tsx";
import Button from "./button.tsx";
import Agreement from "./agreement.tsx";
import PasswordInput from "./PasswordInput.tsx";
import { api_root_url } from "../Settings/constants";

const Login = (props: {navigation: StackNavigationProp<any>}) => {
	const windowHeight: number = Dimensions.get('window').height;

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		const endpoint:string = api_root_url + "user/";

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password
				})
			});

			const fish = await response.text();
			console.log(fish);

		} catch (e:any) { console.error(e); }



		props.navigation.push('Home')
		setSubmitted(true);
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

			<TextInput value={firstName} onChangeText={setFirstName} placeholder='First Name'
								 style={[styles.textInput, (submitted && firstName.length === 0 ? styles.EmptyInput : null)]}/>

			<TextInput value={lastName} onChangeText={setLastName} placeholder='Last Name'
								 style={[styles.textInput, (submitted && lastName.length === 0 ? styles.EmptyInput : null)]}/>

			<TextInput value={email} onChangeText={setEmail} placeholder='Email'
								 style={[styles.textInput, (submitted && email.length === 0 ? styles.EmptyInput : null)]}/>

			<PasswordInput password={password} setPassword={setPassword} submit={submitted}/>

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
	},
	textInput: {
		paddingHorizontal: 10,
		fontSize: 15,
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10
	},
	EmptyInput: {
		borderColor: 'red'
	}
});

export default Login
