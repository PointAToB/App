import { CameraView, CameraType } from "expo-camera";
import { ViewStyle} from "react-native";

const Video = (props: {cameraType: CameraType}) => {
	return (
		<CameraView mode='video' style={{flex: 1}} facing={props.cameraType}/>
	);
}

Video.displayName = 'Video'

export default Video