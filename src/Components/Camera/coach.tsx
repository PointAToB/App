import { CameraView, CameraType } from "expo-camera";
import { ViewStyle} from "react-native";

const Coach = (props: {cameraType: CameraType}) => {
	return (
		<CameraView mode='video' style={{flex: 1}} facing={props.cameraType}/>
	);
}

Coach.displayName = 'Coach'

export default Coach