import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useState } from "react";

import Toggle from "./toggle";
import Close from "./close";
import Selector from "./selector";

import Photo from "./photo";
import Video from "./video";
import Coach from "./coach";

import { CameraType } from "expo-camera";
import Permission,  { getRuntimeEngine } from "./permission";

// TODO: Remove Expo Go condition after app is finalized and add Coach component to options list

// Selector Options
const options: React.ComponentType<{cameraType: CameraType}>[] = [Video, Photo]
if( getRuntimeEngine() === 'reactNative' ) options.push(Coach)

export default function Camera(props: {visible: boolean, setVisible: (display: boolean)=>void}) {
	const [cameraType, setCameraType] = useState<CameraType>('front');
	const [selection, setSelection] = useState(1);
	const [permissionGranted, setPermissionGranted] = useState(false);

	// Dynamically render camera functionality based on selector
		const CameraView = () => {
			const Component = options[selection]
			return <Component cameraType={cameraType}/>
		}
  return (
		<View>
			<Permission setPermissionGranted={setPermissionGranted} permissionGranted={permissionGranted} displayCamera={props.visible} isCameraDisplayed={props.setVisible}/>

			{permissionGranted ?
			<Modal style={styles.main} animationType='slide' visible={props.visible}>
				<View style={styles.camera}>
					<CameraView/>
				</View>
				<View style={styles.menu}>
					<Selector options={options} setSelection={setSelection}/>
					<Toggle size={36} cameraType={cameraType} setCameraType={setCameraType} color={'white'} style={{position: 'absolute', right: 0}}/>
					<Close size={36} onPress={()=>{props.isCameraDisplayed(false)}} color={'white'} style={{position: 'absolute', left: 0}}/>
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
