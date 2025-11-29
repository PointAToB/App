import { View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../Components/button";
import Permission from "../Components/Camera/permission";
import { useState } from "react";
import Toggle from "../Components/Camera/toggle";
import Close from "../Components/Camera/close";
import Selector from "../Components/Camera/selector";
import { Options } from '../Components/Camera/captureOptions'
import { CameraView, CameraRef, CameraLens, CameraMode } from '../Components/Camera/cameraView'


export function Camera (props: {navigation: NativeStackNavigationProp<any>}) {
	const [cameraLens, setCameraLens] = useState('back');
	const [selected, setSelect] = useState(1)
	const proposing = false

	return (
		<View style={styles.main}>
       <CameraView mode={'image'} lens={cameraLens} style={styles.camera}/>

       <View style={styles.menu}>
         <View style={(!proposing ? {flex: 1} : {display: 'none'})}>
           <Selector options={Options} selected={selected} setSelect={setSelect} onPress={()=>console.log('Pressed')}/>
           <Toggle size={36} cameraType={cameraLens} setCameraType={setCameraLens} style={{position: 'absolute', right: 0, color: 'white'}}/>
           <Close size={36} onPress={()=>{props.navigation.pop()}} style={{position: 'absolute', left: 0, color: 'white'}}/>
         </View>

         <View style={(proposing ? {flex: 1, flexDirection: 'row', justifyContent: 'center', gap: '25'} : {display: 'none'})}>
           <Button onPress={ ()=>console.log("Process") } primaryColor='#00C851' textColor='#FFFFFF' text='Process' fontSize={15} width={150}/>
           <Button onPress={ ()=>console.log("Retake") } primaryColor='#fc0303' textColor='#FFFFFF' text='Retake' fontSize={15} width={150}/>
         </View>
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
        bottom: 90,
        left: 0,
        right: 0,
        top: 0,
	},
	menu: {
		position: 'absolute',
		bottom: 50,
		left: 0,
		right: 0,
		height: 90,
		backgroundColor: 'black',
	}
});



