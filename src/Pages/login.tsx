import { StyleSheet, View} from "react-native";
import LineWithText from "../Components/lineWithText";
import Logo from "../Components/logo";
import Notice from "../Components/notice";
import Button from "../Components/button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TextInput from "../Components/textInput";
import {useState} from "react";
import SectionHeader from "../Components/sectionHeader";

const Login = (props: {navigation: NativeStackNavigationProp<any>}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitted, isSubmitted] = useState(false);

	return (
		<View style={styles.main}>
			<Logo primaryColor={"#DD00FF"} secondaryColor={"#7650FF"}/>

			<SectionHeader header='Login' subHeader='Enter your credentials to stay on track' style={styles.header}/>

			<TextInput value={email} onChangeText={setEmail} placeholder='Email' submitted={submitted}/>
			<TextInput value={password} onChangeText={setPassword} placeholder='Password' submitted={submitted} hideText={true}/>

			<Button onPress={()=>{props.navigation.push('MainTabs')}} primaryColor='#DD00FF' secondaryColor='#7650FF' textColor='#FFFFFF' text='Login' fontSize={15}/>

			<Notice/>

			<LineWithText text='or'/>

			<Button onPress={()=>{props.navigation.push('Create Account')}} primaryColor='#000000' textColor='#FFFFFF' text='Create an account' fontSize={15} width={200}/>
		</View>
	);
}

const styles = StyleSheet.create({
		main: {
		marginTop: 200,
		marginLeft: 25,
		marginRight: 25
	},
	header: {
		marginBottom: 15,
		marginTop: 15
	}
});

export default Login
