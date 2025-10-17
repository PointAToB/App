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
	const [submitted, isSubmitted] = useState(false);
	const [success, isSuccess] = useState(false);


	const handleSubmit = () => {
		setErrors([]);
		isSubmitted(true);


		// Verify fields are well-formed
		setErrors(verifyFields(firstName, lastName, email, password, passwordReEntry));

		// If error array is not empty fields are not well-formed
		if(errors.length !== 0) return;

		// If create account fails, account already exists
		createAccount(firstName, lastName, email, password).then(
			(promise: boolean | undefined)=> {
				isSuccess(promise !== undefined)
			},
			()=> {
				isSuccess(false)
			}
		);

		if(!success) {
			setErrors(['Account with this email already exists']);
			return;
		}

		else {
			props.navigation.push('Home');
			isSubmitted(false);
		}
	}

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>

			<SectionHeader header='Create an Account' subHeader='You are one step closer to greatness' style={styles.header}/>

			<TextInput value={firstName} onChangeText={setFirstName} placeholder='First Name' submitted={submitted}/>
			<TextInput value={lastName} onChangeText={setLastName} placeholder='Last Name' submitted={submitted}/>
			<TextInput value={email} onChangeText={setEmail} placeholder='Email' submitted={submitted}/>
			<TextInput value={password} onChangeText={setPassword} placeholder='Password' submitted={submitted} hideText={true}/>
			<TextInput value={passwordReEntry} onChangeText={setPasswordReEntry} placeholder='Re-enter Password' submitted={submitted} hideText={true}/>

			<ErrorMessage errors={errors} display={submitted}/>

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
