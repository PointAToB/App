import { CameraComponent } from "./types";
import { useImperativeHandle } from "react";
import { RNMediapipe } from "@thinksys/react-native-mediapipe";
import {View} from "react-native";

const Plus: CameraComponent = (props) => {
	const { cameraType, ref } = props;

	useImperativeHandle(ref, () => ({
		capture: async () => {
			console.log('pressed')
		}
	}));

	return (
		<View>
			<RNMediapipe
				width={400}
				height={800}
			/>
		</View>
	);
};

Plus.displayName = 'Plus'
Plus.captureColor = '#d906e1'

export default Plus
