import LinearGradient from "react-native-linear-gradient";
import Logo from "./logo.tsx";

const LoadingScreen = () => {
	return (
		<LinearGradient
			colors={["#DD00FF", "#7650FF"]}
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
		>
			<Logo primaryColor={'#FFFFFF'}/>
		</LinearGradient>
	);
}