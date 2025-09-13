import {StyleSheet, Text, View, ViewStyle} from "react-native";



const SectionHeader = (props: {header: string, subHeader: string, style: ViewStyle}) => {
	return (
		<View style={props.style}>
			<Text style={[styles.text, styles.bold]} >{props.header}</Text>
			<Text style={[styles.text, styles.thin]} >{props.subHeader}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 15,
		textAlign: 'center',
		color: '#000000'
	},
    bold: { fontWeight: 'bold' },
    thin: { fontWeight: 'thin' }
});

export default SectionHeader;