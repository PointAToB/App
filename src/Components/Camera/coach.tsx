import { CameraType } from "expo-camera";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { StyleSheet } from "react-native";
import {  useRef } from "react";
import {CameraComponent} from "./types";


const Coach: CameraComponent = (props: {cameraType: CameraType}) => {
	const device = useCameraDevice(props.cameraType);
	if(!device) return;

	const innerRef = useRef<Camera>(null)

	return (
		<Camera ref={innerRef} isActive={true} device={device} style={StyleSheet.absoluteFill}/>
	);
}


Coach.displayName = 'Coach'
Coach.captureColor = '#003D5B'

export default Coach