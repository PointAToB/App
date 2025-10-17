import { CameraView, CameraType } from "expo-camera";
import { CameraComponent } from "./types";

const Video: CameraComponent = (props: {cameraType: CameraType}) => {
	return (
		<CameraView mode='video' style={{flex: 1}} facing={props.cameraType}/>
	);
}

Video.displayName = 'Video'
Video.captureColor = '#DD1C1A'

export default Video