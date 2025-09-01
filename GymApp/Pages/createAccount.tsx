import { StyleSheet, View, Text, Dimensions} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

import Logo from "../Components/logo.tsx";
import Button from "../Components/button.tsx";
import Notice from "../Components/notice.tsx";
import TextInput from "../Components/textInput.tsx";
import ErrorMessage from "../Components/errorMessage.tsx";

import {verifyCreateAccountFields} from "../Functions/verifyCreateAccountFields.ts";
import createAccount  from "../Functions/createAccount.ts";

const CreateAccount = (props: {navigation: StackNavigationProp<any>}) => {
	const windowHeight: number = Dimensions.get('window').height;
	// User
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [passwordReEntry, setPasswordReEntry] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors] = useState<string[] | []>([]);

	const handleSubmit = async () => {
		setSubmitted(true);

		// Verify fields are well-formed else set error list for error message component and does not submit.
		const isWellFormed: boolean = verifyCreateAccountFields(firstName, lastName, email, password, passwordReEntry, errors, setErrors);
		console.log("Well-formed: " + isWellFormed)
		if (!isWellFormed) return;

		setErrors([]);

		//await createAccount(firstName, lastName, email, password);

		props.navigation.push('Home')

		setSubmitted(false);
	}

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>
			<View style={{paddingTop: windowHeight / 10}}/>

			<View style={styles.header}>
				{/* eslint-disable-next-line react-native/no-inline-styles */}
				<Text style={[styles.text, {fontWeight: 'bold'}]} >Create an Account</Text>
				{/* eslint-disable-next-line react-native/no-inline-styles */}
				<Text style={[styles.text, {fontWeight: 'thin'}]} >You are one step closer to greatness</Text>
			</View>

			<TextInput value={firstName} onChangeText={setFirstName} placeholder='First Name' submitted={submitted}/>
			<TextInput value={lastName} onChangeText={setLastName} placeholder='Last Name' submitted={submitted}/>
			<TextInput value={email} onChangeText={setEmail} placeholder='Email' submitted={submitted}/>
			<TextInput value={password} onChangeText={setPassword} placeholder='Password' submitted={submitted} hideText={true}/>
			<TextInput value={passwordReEntry} onChangeText={setPasswordReEntry} placeholder='Re-enter Password' submitted={submitted} hideText={true}/>

			<ErrorMessage errors={errors} display={submitted}/>

			<Button onPress={handleSubmit} primaryColor="#DD00FF" secondaryColor="#7650FF" textColor="#FFFFFF" text="Continue" fontSize={15}/>

			<Notice/>
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

export default CreateAccount
