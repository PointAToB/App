import * as yup from 'yup';
import { useState } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";


const schema = yup.object({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long.')
  	.matches(/[a-z]+/, 'Password must contain at least one lowercase letter.')
 		.matches(/[A-Z]+/, 'Password must contain at least one uppercase letter.')
  	.matches(/\d+/, 'Password must contain at least one number.')
});

const PasswordInput = (props: {submit: boolean, password: string, setPassword: (text: string)=>void}) => {
	const [errors, setErrors] = useState([]);
	const [reEnter, setReEnter] = useState('');

	const verifyPassword = async (text: string) => {
		props.setPassword(text);
		try {
			await schema.validate({ password: text }, { abortEarly: false });
			setErrors([]);
		} catch (e: any) { setErrors(e.errors); }
	}

	const compare = (password1: string, password2: string): boolean => {
		if (password1 === '' || password2 === '') return false;
		return !(password1 === password2);
	}

	return (
		<View>
			<TextInput value={props.password} onChangeText={verifyPassword} secureTextEntry={true} style={[styles.textInput, (props.password.length === 0 && props.submit ? styles.EmptyInput : null)]} placeholder='Password'/>
			<TextInput value={reEnter} onChangeText={setReEnter} secureTextEntry={true} style={[styles.textInput, (reEnter.length === 0 && props.submit ? styles.EmptyInput : null)]} placeholder='Re-enter Password'/>
			{ props.submit && errors.length > 0 &&
				<View>
					{ errors.map(error => (
						<Text style={styles.badInput}>{error}</Text>
					))}
				</View>
			}
			{ compare(props.password, reEnter) && props.submit &&
					<View>
						<Text style={styles.badInput}>Passwords do not match</Text>
					</View>
			}
		</View>
	);
}


const styles = StyleSheet.create({
	textInput: {
		paddingHorizontal: 10,
		fontSize: 15,
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10
	},
	badInput: {
		color: 'red',
		fontSize: 12,
		fontWeight: 'bold',
		marginTop: 10
	},
	EmptyInput: {
		borderColor: 'red'
	}
});


export default PasswordInput;
