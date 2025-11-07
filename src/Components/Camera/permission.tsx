<<<<<<< HEAD
import { Alert, Platform } from "react-native";
import { useEffect, useState } from "react";
import { request, PERMISSIONS, RESULTS, Permission as Perm} from "react-native-permissions";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

// React native permission request for audio / video
const requestPermissions = async () => {
	let videoPermission: Perm;

	if (Platform.OS === 'ios') videoPermission = PERMISSIONS.IOS.CAMERA;
	else if (Platform.OS === 'android') videoPermission = PERMISSIONS.ANDROID.CAMERA;
	else { console.warn('Unsupported platform'); return; }

	const videoGranted =  RESULTS.GRANTED === await request(videoPermission)

	let audioPermission: Perm;

	if (Platform.OS === 'ios') audioPermission = PERMISSIONS.IOS.MICROPHONE;
	else if (Platform.OS === 'android') audioPermission = PERMISSIONS.ANDROID.RECORD_AUDIO;
	else { console.warn('Unsupported platform'); return; }

	const audioGranted =  RESULTS.GRANTED === await request(audioPermission)

	return audioGranted && videoGranted
}

const permissionHandler = async (setPermissionGranted: (permissionGranted: boolean)=>void) => {
	const success = await requestPermissions();
	if(success) setPermissionGranted(true)
}
=======
import { Alert } from "react-native";
import { useEffect } from "react";
import { Camera as expoCamera, PermissionResponse } from "expo-camera";

export default function Permission(props: {setPermissionGranted: (permissionGranted: boolean)=>void, permissionGranted: boolean,
	displayCamera: boolean, isCameraDisplayed: (displayCamera: boolean)=>void}) {
>>>>>>> origin/main

export default function Permission(props: { displayCamera: boolean, toggleCamera: (displayCamera: boolean)=>void }) {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const [permissionGranted, setPermissionGranted] = useState(false)
  useEffect(() => {
		if (!permissionGranted && props.displayCamera) {
			Alert.alert(
				"Camera Access",
				"We need your permission to enable camera access",
				[
					{text: "Cancel", onPress: ()=>{ props.toggleCamera(false) }, style: "cancel"},
					{text: "OK", onPress: ()=> { void permissionHandler(setPermissionGranted)}},
				],
				{cancelable: true}
			);
		}
		if (permissionGranted && props.displayCamera) {
			navigation.push('Camera')
			props.toggleCamera(false)
		}
	}, [permissionGranted, props.displayCamera]);


	return null;
<<<<<<< HEAD
}
=======
}

// TODO: This method handles the permissions of camera between the runtimes of expo go and react native.
// TODO: When app is finalized simplify permissionHandler function to use react native permissions exclusively.
async function permissionHandler(setPermissionGranted: (permissionGranted: boolean)=>void) {
	const res: PermissionResponse = await expoCamera.requestCameraPermissionsAsync();
	if(res.status && res.granted) setPermissionGranted(true);
}

>>>>>>> origin/main
