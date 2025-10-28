import { CameraView } from "expo-camera";
import {CameraComponent } from "./types";
import {useImperativeHandle, useRef } from "react";

const Photo: CameraComponent = (props) => {
	const { cameraType, ref } = props;
  const innerRef = useRef<CameraView>(null);

	useImperativeHandle(ref, () => ({
		capture: async () => {
			const photo = await innerRef.current?.takePictureAsync()
		}
	}));

	return (
		<CameraView ref={innerRef} mode='picture' style={{flex: 1}} facing={cameraType}/>
	);
};

Photo.displayName = 'Photo'
Photo.captureColor = '#FFFFFF'

export default Photo
