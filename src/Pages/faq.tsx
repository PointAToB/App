import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import Logo from "../Components/logo.tsx";
import LineWithText from "../Components/lineWithText.tsx";
import Button from "../Components/button.tsx";
import { StackNavigationProp } from "@react-navigation/stack";

// Starting with this as a baseline, I think we will add more
// questions and answers as we make more changes and we can
// get screenshots to better show things 
const FAQ = (props: { navigation: StackNavigationProp<any> }) => {
	const windowHeight: number = Dimensions.get('window').height;

	const faqs = [
		{
			question: "How does the app track my movements?",
			answer: "We use Vision AI technology to monitor your form in real time and give immediate feedback on your posture and technique."
		},
		{
			question: "Do I need any special equipment?",
			answer: "No! As long as your camera is enabled and you’re in view, our AI can track your form using just your phone."
		},
		{
			question: "Is my movement data stored?",
			answer: "No, we respect your privacy. All form feedback is processed in real-time and not stored unless explicitly enabled by you."
		},
		// Add more FAQ items here as needed
	];

	return (
		<ScrollView style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"} />

			<View style={{ paddingTop: windowHeight / 20 }} />
			<View style={styles.header}>
				<Text style={[styles.text, { fontWeight: 'bold' }]}>FAQ</Text>
				<Text style={[styles.text, { fontWeight: 'thin' }]}>Answers to common questions about our app</Text>
			</View>

			<LineWithText text="frequently asked" />

			{faqs.map((item, index) => (
				<View key={index} style={styles.faqItem}>
					<Text style={[styles.text, styles.question]}>{item.question}</Text>
					<Text style={[styles.text, styles.answer]}>{item.answer}</Text>
				</View>
			))}

			<View style={{ paddingTop: windowHeight / 15 }} />
			<Button
				onPress={() => props.navigation.goBack()}
				primaryColor="#000000"
				textColor="#FFFFFF"
				text="Back"
				fontSize={15}
				width={150}
			/>

			<View style={{ paddingBottom: windowHeight / 10 }} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	main: {
		margin: 25,
	},
	header: {
		marginBottom: 15,
	},
	text: {
		fontSize: 15,
		textAlign: 'center',
		color: '#000000',
	},
	question: {
		fontWeight: 'bold',
		marginTop: 15,
		textAlign: 'left',
	},
	answer: {
		fontWeight: 'normal',
		marginTop: 5,
		marginBottom: 10,
		textAlign: 'left',
		color: '#333333'
	},
	faqItem: {
		marginBottom: 10,
	},
});

export default FAQ;
