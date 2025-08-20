import LinearGradient from "react-native-linear-gradient";
import Logo from "./logo.tsx";
import { Dimensions } from "react-native";

const LoadingScreen = () => {
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


export default LoadingScreen;