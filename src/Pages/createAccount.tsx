import { StyleSheet, View} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import Logo from "../Components/logo";
import Button from "../Components/button";
import Notice from "../Components/notice";
import TextInput from "../Components/textInput";
import ErrorMessage from "../Components/errorMessage";
import SectionHeader from "../Components/sectionHeader";
import verifyFields from "../Functions/verifyCreateAccountFields";
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

		// Verify fields are well-formed
		setErrors(verifyFields(firstName, lastName, email, password, passwordReEntry));
		// If error array is not empty fields are not well-formed
		if(errors.length !== 0) return;

		// If create account fails, account already exists, fetch error(network issue), or Bad request
		const res = await createAccount(firstName, lastName, email, password)

		if(!res?.success) {
			setErrors([res!.msg]);
			return;
		}

		props.navigation.push('Home');
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
