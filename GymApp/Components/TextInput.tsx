import { TextInput as Ti, StyleSheet } from "react-native";

const TextInput = (props: {value: string, onChangeText: (text: string)=>void, placeholder: string, submitted: boolean}) => {
	const style = (condition: string) => {
		return [styles.textInput, (condition.length === 0 && props.submitted ? styles.EmptyInput : null)]
	}

	return (
		<Ti value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} style={style(props.value)}/>
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
	EmptyInput: {
		borderColor: 'red'
	}
});

export default TextInput;