import { LinearGradient } from "expo-linear-gradient"
import Logo from "../Components/logo";
import { Dimensions } from "react-native";

export default function LoadingScreen() {
	const windowHeight: number = Dimensions.get('window').height;

	return (
			<LinearGradient
			colors={["#DD00FF", "#7650FF"]}
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			style={{height: windowHeight, justifyContent: 'center'}}
		>
			<Logo primaryColor={'#FFFFFF'} scale={1.5}/>
		</LinearGradient>
	);
}


