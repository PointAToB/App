import { StyleSheet, View} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import Logo from "../Components/logo";
import Button from "../Components/button";
import Notice from "../Components/notice";
import TextInput from "../Components/textInput";
import ErrorMessage from "../Components/errorMessage";
import SectionHeader from "../Components/sectionHeader";
import createAccount from "../Functions/createAccount";

const CreateAccount = (props: {navigation: StackNavigationProp<any>}) => {
	// User
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [passwordReEntry, setPasswordReEntry] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [submit, isSubmitted] = useState(false);

	const handleSubmit = async () => {
		setErrors([]);
		isSubmitted(true);

		const res = await createAccount(firstName, lastName, email.toLowerCase(), password, passwordReEntry)

		if(!res?.success) {
			setErrors([res!.msg]);
			return;
		}
		props.navigation.replace('Main');
	}

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>

			<SectionHeader header='Create an Account' subHeader='You are one step closer to greatness' style={styles.header}/>

			<TextInput value={firstName} onChangeText={setFirstName} placeholder='First Name' submit={submit}/>
			<TextInput value={lastName} onChangeText={setLastName} placeholder='Last Name' submit={submit}/>
			<TextInput value={email} onChangeText={setEmail} placeholder='Email' submit={submit}/>
			<TextInput value={password} onChangeText={setPassword} placeholder='Password' hideText submit={submit}/>
			<TextInput value={passwordReEntry} onChangeText={setPasswordReEntry} placeholder='Re-enter Password' hideText submit={submit}/>
			<ErrorMessage errors={errors}/>

			<Button onPress={handleSubmit} primaryColor="#DD00FF" secondaryColor="#7650FF" textColor="#FFFFFF" text="Continue" fontSize={15}/>
			<Notice/>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		marginTop: 100,
		marginLeft: 25,
		marginRight: 25
	},
	header: {
		marginBottom: 15,
		marginTop: 15
	}
});

export default CreateAccount
