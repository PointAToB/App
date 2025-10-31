import { View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../Components/button";
import Permission from "../Components/Camera/permission";
import { CameraFunctions, CameraComponent } from "../Components/Camera/types";
import Photo from "../Components/Camera/photo";
import Video from "../Components/Camera/video";
import Coach from "../Components/Camera/coach";
import {useRef, useState} from "react";
import Toggle from "../Components/Camera/toggle";
import Close from "../Components/Camera/close";
import { CameraType } from "expo-camera";
import Selector from "../Components/Camera/selector";
import CameraView from "../Components/Camera/cameraView";

const options: CameraComponent[] = [Video, Photo, Coach]

export function Camera (props: {navigation: NativeStackNavigationProp<any>}) {
	const [cameraType, setCameraType] = useState<CameraType>('front');
	const [selected, setSelect] = useState(1)
	const ref = useRef<CameraFunctions>(null)

	return (
		<View style={styles.main}>
			<CameraView cameraType={cameraType} ref={ref} Component={options[selected]} style={styles.camera}/>
			<View style={styles.menu}>
				<Selector options={options} selected={selected} setSelect={setSelect} onPress={async () => await ref.current!.capture()}/>
				<Toggle size={36} cameraType={cameraType} setCameraType={setCameraType} color={'white'} style={{position: 'absolute', right: 0}}/>
				<Close size={36} onPress={()=>{props.navigation.pop()}} color={'white'} style={{position: 'absolute', left: 0}}/>
			</View>
		</View>
	);
}

export function OpenCamera() {
	const [displayCamera, toggleCamera] = useState(false)
	return (
		<View>
			<Permission displayCamera={displayCamera} toggleCamera={toggleCamera}/>
			<Button onPress={ ()=>toggleCamera(true) } primaryColor='#DD00FF' secondaryColor='#7650FF' textColor='#FFFFFF' text='Open Camera' fontSize={15} width={150}/>
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



