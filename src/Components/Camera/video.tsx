import { CameraView, CameraType } from "expo-camera";
import { CameraComponent } from "./types";
import { useImperativeHandle, useRef, useState } from "react";

const Video: CameraComponent = (props) => {
	const {cameraType, ref} = props;
	const innerRef = useRef<CameraView>(null)
	const [isRecording, setIsRecording] = useRef(false)

	useImperativeHandle(ref, () => ({
		capture: async () => {
			if (isRecording) {
				setIsRecording(false)
				innerRef.current?.stopRecording()
			}
			else {
				setIsRecording(true)
				const video = await innerRef.current?.recordAsync()
				console.log('Video ', video)
			}


		}
	}));

	return (
		<CameraView ref={innerRef} mode='video' style={{flex: 1}} facing={cameraType}/>
	);
}

Video.displayName = 'Video'
Video.captureColor = '#DD1C1A'

export default Video