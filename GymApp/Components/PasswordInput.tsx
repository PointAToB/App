import { TextInput, View, StyleSheet, Text } from "react-native";

const PasswordInput = (props: {
	submitted: boolean,
	password: string, setPassword: (text: string)=>void,
	passwordReEntry: string, setPasswordReEntry: (text: string)=>void
}) => {

	// Used for dynamic styling of passwordInput
	const style = (condition: string) => {
		return [styles.textInput, (condition.length === 0 && props.submitted ? styles.EmptyInput : null)]
	}

	return (
		<View>
			<TextInput value={props.password} onChangeText={props.setPassword} secureTextEntry={true} style={style(props.password)} placeholder='Password'/>
			<TextInput value={props.passwordReEntry} onChangeText={props.setPasswordReEntry} secureTextEntry={true} style={style(props.passwordReEntry)} placeholder='Re-enter Password'/>
			{ props.submitted && errors.length > 0 &&
				<View>
					{ errors.map((error, index) => (
						<Text key={index} style={styles.badInput}>{error}</Text>
					))}
				</View>
			}
			{/*	Display only if the form was submitted and the password fields are not equal */}
			{ props.submitted && !compare(props.password, reEnter) &&
					<View>
						<Text style={styles.badInput}>Passwords do not match</Text>
					</View>
			}
			<Text>{props.password}  {reEnter}  valid { props.valid ? 'true' : 'false'}</Text>
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
