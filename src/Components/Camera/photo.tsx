import { CameraView } from "expo-camera";
import { CameraComponent } from "./types";
import {useImperativeHandle, useRef, useState} from "react";
import authFetch from "../../Functions/Authentication/authFetch";
import { api_root_url } from "../../Settings/constants";

const Photo: CameraComponent = (props) => {
	const { cameraType, ref } = props;
  const innerRef = useRef<CameraView>(null);

	useImperativeHandle(ref, () => ({
		capture: async () => {
			 const photo = await innerRef.current?.takePictureAsync({base64: true})
			 // Send photo to image backend
			 try {
				const res = await authFetch(api_root_url + 'image', {
					method: 'POST',
					body: photo?.base64
				})
			 } catch(e) { console.log(e) }
		}
	}));

	return (
		<CameraView ref={innerRef} mode='picture' style={{flex: 1}} facing={cameraType}/>
	);
};

Photo.displayName = 'Photo'
Photo.captureColor = '#FFFFFF'

export default Photo
