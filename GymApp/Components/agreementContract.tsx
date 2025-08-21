import { Pressable, View, Text, StyleSheet, Modal } from "react-native";

const AgreementContract = (props: {setPopupContent: (content: string)=>void, content: string}) => {
	return(
		<Modal visible={!(props.content === 'close')} animationType={'slide'}>
			<View style={styles.toggle}>
				<Pressable style={[styles.button, (props.content === 'terms' ? styles.select : null)]} onPress={()=>{props.setPopupContent('terms');}}>
					<Text style={styles.text}>Terms Of Service</Text>
				</Pressable>
				<Pressable style={[styles.button, (props.content === 'privacy' ? styles.select : null)]} onPress={()=>{props.setPopupContent('privacy');}}>
					<Text style={styles.text}>Privacy Policy</Text>
				</Pressable>
				<Pressable style={styles.button} onPress={()=>{props.setPopupContent('close');}}>
					<Text style={styles.text}>Close</Text>
				</Pressable>
			</View>
			<View style={styles.toggle}>
				<Text style={[styles.textBody, (props.content === 'terms') ? null : styles.hidden]}>
					These are the Terms
				</Text>
				<Text style={[styles.textBody, (props.content === 'privacy') ? null : styles.hidden]}>
					This is the privacy policy
				</Text>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	toggle: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'nowrap',
		justifyContent: 'center'
	},
	button: {
		backgroundColor: '#FFFFFF',
		padding: 10,
		margin: 10,
		height: 40,
		borderStyle: 'solid',
		borderColor: '#828282',
		borderWidth: 1,
		borderRadius: 15,
	},
	select: {
		backgroundColor: "#7650FF",
		color: '#FFFFFF'
	},
	hidden: {
		display: 'none'
	},
	text: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#000000'
	},
	textBody: {
		fontSize: 15,
		fontWeight: 'thin',
		color: '#000000'
	},
});


export default AgreementContract;