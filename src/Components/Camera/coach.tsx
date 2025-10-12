import { CameraType } from "expo-camera";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { StyleSheet } from "react-native";
import {useRef} from "react";

const Coach = (props: {cameraType: CameraType}) => {
	const device = useCameraDevice(props.cameraType)
	if(!device) return;
	const ref = useRef<Camera>(null)

	return (
		<Camera ref={ref} isActive={true} device={device} style={StyleSheet.absoluteFill}/>
	);
}

Coach.displayName = 'Coach'

export default Coach