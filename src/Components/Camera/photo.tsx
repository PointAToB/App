import { CameraView } from "expo-camera";
import { CameraComponent } from "./types";
import {useImperativeHandle, useRef, useState} from "react";

const Photo: CameraComponent = (props) => {
	const { cameraType, ref } = props;
  const innerRef = useRef<CameraView>(null);
	const [photo, setPhoto] = useState<{ uri: string } | undefined>()

	useImperativeHandle(ref, () => ({
		capture: async () => {
			 setPhoto(await innerRef.current?.takePictureAsync())
		}
	}));

	return (
		<CameraView ref={innerRef} mode='picture' style={{flex: 1}} facing={cameraType}/>
	);
};

Photo.displayName = 'Photo'
Photo.captureColor = '#FFFFFF'

export default Photo
