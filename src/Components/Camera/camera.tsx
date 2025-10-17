import { View, StyleSheet, Modal } from 'react-native';
import { useState, useRef } from "react";
import Toggle from "./toggle";
import Close from "./close";
import Selector from "./selector";
import Photo from "./photo";
import Video from "./video";
import Coach from "./coach";
import CameraView from "./CameraView";
import { CameraType } from "expo-camera";
import Permission,  { getRuntimeEngine } from "./permission";
import { CameraComponent, CameraFunctions } from "./types";

// TODO: Remove this when app is finalized, optionsList of useState should be [Video, Photo, Coach] without condition of engine type checking.
const options: CameraComponent[] = [Video, Photo]
//if(getRuntimeEngine() === 'reactNative') options.push(Coach)

export default function Camera(props: {visible: boolean, setVisible: (visible: boolean)=>void}) {
	const [cameraType, setCameraType] = useState<CameraType>('front');
	const [selection, setSelection] = useState(1);
	const [permissionGranted, setPermissionGranted] = useState(false);
	const ref = useRef<CameraFunctions>(null)

  return (
		<View>
			<Permission setPermissionGranted={setPermissionGranted} permissionGranted={permissionGranted} displayCamera={props.visible} isCameraDisplayed={props.setVisible}/>
			{permissionGranted ?
			<Modal style={styles.main} animationType='slide' visible={props.visible}>
				<View style={styles.camera}>
					<CameraView ref={ref} cameraType={cameraType} Component={options[selection]}/>
				</View>
				<View style={styles.menu}>
					<Selector options={options} setSelection={setSelection}/>
					<Toggle size={36} cameraType={cameraType} setCameraType={setCameraType} color={'white'} style={{position: 'absolute', right: 0}}/>
					<Close size={36} onPress={()=>{props.setVisible(false)}} color={'white'} style={{position: 'absolute', left: 0}}/>
				</View>
			</Modal>
				: null
			}
		</View>
  );
}

const styles = StyleSheet.create({
	main: {
		width: '100%',
		height: '100%'
	},
	camera: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 90,
		display: 'flex'
	},
	menu: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 90,
		backgroundColor: 'black',
	}
});
