import { CameraComponent } from "./types";
import { RTCView, mediaDevices, MediaStream } from "react-native-webrtc";
import {useEffect, useImperativeHandle, useState} from "react";


const Coach: CameraComponent = (props) => {
	const {cameraType, ref} = props;
	const [stream, setStream] = useState<MediaStream | null>(null);

	useImperativeHandle(ref, () => ({
		capture: async () => {
			if(stream)  stop()
			else await start()
		}
	}));

	useEffect(() => {
		void start()
	}, [cameraType]);

	const start = async () => {
		const cameraFacing = (cameraType === 'front' ?  'user' : 'environment')
		// If cameraFacing is updated we have to stop the previous stream
		stop()

		try {
			const media = await mediaDevices.getUserMedia({
				audio: false,
				video: {
					frameRate: 30,
					facingMode: cameraFacing
				}
			});
			setStream(media);
		} catch (e) { console.log(e) }
	}

	const stop =  () => {
		stream?.release();
		setStream(null)
	}

	return (
		<RTCView mirror style={{flex: 1}} objectFit={'cover'} streamURL={stream?.toURL()}/>
	);
}

Coach.displayName = 'Coach'
Coach.captureColor = '#003D5B'

export default Coach
