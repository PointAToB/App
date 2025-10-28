import { useRef, useState } from "react";
import { TextInput as Ti, StyleSheet } from "react-native";

const TextInput = (props: {value: string, onChangeText: (text: string)=>void, placeholder: string, hideText?: boolean, submit: boolean}) => {
	// State Options: 
	// -1: User has not interacted with input 
	// 0: User left blank
	// 1: User filled
	const [state, setState] = useState(-1);
	const ref = useRef<Ti>(null)

	const style = (condition: string) => {
		return [styles.textInput, ((condition.length === 0 && props.submit) ? styles.EmptyInput : null)]
	}

	return (
		<Ti ref={ref} onFocus={()=>{setState(0)}} secureTextEntry={props.hideText} value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} style={style(props.value)}/>
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