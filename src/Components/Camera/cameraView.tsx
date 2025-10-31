import {CameraViewComponent} from "./types";
import {View} from "react-native";
import {useState} from "react";



const CameraView = (props: CameraViewComponent) => {
	const {cameraType, ref, Component, style} = props;
	const [photo, setPhoto] = useState<{ uri: string } | undefined>()
	return (
		<View style={style}>
			<Component cameraType={cameraType} ref={ref}/>
		</View>
	);
}

export default CameraView;