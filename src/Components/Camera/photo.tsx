import { CameraView, CameraType } from "expo-camera";
import { RefObject, forwardRef, useImperativeHandle, useRef } from "react";

const Photo = forwardRef((props: {cameraType: CameraType}, ref) => {
	const internalState = useRef(null);

	useImperativeHandle(ref, ()=> ({
		capture: capture(ref),
	}));

	return (
		<CameraView mode='picture' style={{flex: 1}} facing={props.cameraType}/>
	);
});

Photo.displayName = 'Photo'

export default Photo

async function capture(ref: any) {
	ref.current?.takePictureAsync();
}