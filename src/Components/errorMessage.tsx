import {Text, View, StyleSheet} from "react-native";


const ErrorMessage = (props: {errors: string[]}) => {
	return (
		<View>
		{ props.errors.length > 0 && props.errors.length > 0 &&
				<View>
					{ props.errors.map((error: string, index: number) => (
						<Text key={index} style={styles.error}>{error}</Text>
					))}
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
		error: {
		color: 'red',
		fontSize: 12,
		fontWeight: 'bold',
		marginTop: 10
	}
});

export default ErrorMessage;