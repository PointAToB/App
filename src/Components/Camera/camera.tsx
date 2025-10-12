import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState } from "react";

import Toggle from "./toggle";
import Close from "./close";
import Selector from "./selector";

import Photo from "./photo";
import Video from "./video";

import { CameraType } from "expo-camera";

// Selector Options
const options: React.ComponentType<{cameraType: CameraType}>[] = [Video, Photo]

// TODO: Remove Expo Go condition after app is finalized and add Coach component to options list





export default function Camera() {
	const [cameraType, setCameraType] = useState<CameraType>('front');
	const [selection, setSelection] = useState(1);

	// Dynamically render camera functionality based on selector
		const CameraView = () => {
			const Component = options[selection]
			return <Component cameraType={cameraType}/>
		}
  return (
		<View style={styles.main}>
			<View style={styles.camera}>
				<CameraView/>
			</View>
			<View style={styles.menu}>
				<Selector options={options} setSelection={setSelection}/>
				<Toggle size={36} cameraType={cameraType} setCameraType={setCameraType} color='white' style={{position: 'absolute', right: 0}}/>
 				<Close size={36} cameraType={cameraType} setDisplay={()=>{console.log()}} color='white' style={{position: 'absolute', left: 0}}/>
			</View>
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
