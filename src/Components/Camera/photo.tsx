import { CameraView, CameraType } from "expo-camera";
import { ViewStyle} from "react-native";

const Photo = (props: {cameraType: CameraType}) => {
	return (
		<CameraView mode='picture' style={{flex: 1}} facing={props.cameraType}/>
	);
}

Photo.displayName = 'Photo'

export default Photo