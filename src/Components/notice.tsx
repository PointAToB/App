import { Text, StyleSheet, Pressable, View } from "react-native";
import Agreement from "./agreement";
import {useState} from "react";

const Notice = () => {
	const [content, setPopupContent] = useState('close');
	return(
		<View style={styles.agreement} >
				<Text style={styles.text} >By clicking continue, you agree to our </Text>
				<Pressable onPress={()=>{setPopupContent('terms')}}>
					<Text style={styles.bold} >Terms of Service</Text>
				</Pressable >
				<Text style={styles.text} > and </Text>
				<Pressable onPress={()=>{setPopupContent('privacy')}}>
					<Text style={styles.bold} >Privacy Policy</Text>
				</Pressable>

			<Agreement setPopupContent={setPopupContent} content={content}/>

			</View>
	);
}

const styles = StyleSheet.create({
	agreement: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
		marginLeft: -5,
		marginRight: -5,
	},
	text: {
		fontSize: 10,
	},
	bold: {
		fontWeight: 'bold',
		fontSize: 12,
		lineHeight: 12,
		overflow: 'scroll'
	}
});

export default Notice;