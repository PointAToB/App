import { CameraView, CameraType } from "expo-camera";
import { CameraComponent } from "./types";
import { useImperativeHandle, useRef, useState } from "react";

const Video: CameraComponent = (props) => {
	const {cameraType, ref} = props;
	const innerRef = useRef<CameraView>(null)
	const [isRecording, setIsRecording] = useState(false)
	const [video, setVideo] = useState<{ uri: string } | undefined>()

	useImperativeHandle(ref, () => ({
		capture: async () => {
			if (isRecording) stopRecord()
			else setVideo(await startRecord())
		}
	}));

	const startRecord = async () => {
		try {
			setIsRecording(true)
			return await innerRef.current?.recordAsync();
		} catch (e) { console.log(e) }
	}

	const stopRecord = () => {
		setIsRecording(false)
				innerRef.current?.stopRecording()
	}

	return (
		<CameraView ref={innerRef} mode='video' style={{flex: 1}} facing={cameraType}/>
	);
}

Video.displayName = 'Video'
Video.captureColor = '#DD1C1A'

export default Video