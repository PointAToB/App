import { Alert, Platform } from "react-native";
import { useEffect } from "react";
import { request, PERMISSIONS, RESULTS, Permission as Perm} from "react-native-permissions";

// React native permission request for audio / video
async function requestNativePermissions() {
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


// TODO: Remove imports when app is finalized
import Constants, { ExecutionEnvironment } from "expo-constants";
import {Camera as expoCamera, PermissionResponse} from "expo-camera";


export default function Permission(props: {setPermissionGranted: (permissionGranted: boolean)=>void, permissionGranted: boolean,
	displayCamera: boolean, isCameraDisplayed: (displayCamera: boolean)=>void}) {

  useEffect(() => {
		if (!props.permissionGranted && props.displayCamera) {
			Alert.alert(
				"Camera Access",
				"We need your permission to enable camera access",
				[
					{text: "Cancel", onPress: ()=>props.isCameraDisplayed(false), style: "cancel"},
					{text: "OK", onPress: ()=>{ void permissionHandler(props.setPermissionGranted) }},
				],
				{cancelable: true}
			);
		}
	}, [props.permissionGranted, props.displayCamera]);
	return null;
}

// TODO: This method handles the permissions of camera between the runtimes of expo go and react native.
// TODO: When app is finalized simplify permissionHandler function to use react native permissions exclusively.
async function permissionHandler(setPermissionGranted: (permissionGranted: boolean)=>void) {
	const runtime = getRuntimeEngine()
	if(runtime === 'expoGo') {
		 const videoPermission: PermissionResponse = await expoCamera.requestCameraPermissionsAsync();
		 const audioPermission: PermissionResponse = await expoCamera.requestMicrophonePermissionsAsync();
		 if(videoPermission.granted && audioPermission.granted) setPermissionGranted(true);
	}

	else if(runtime === 'reactNative') {
		 const res = await requestNativePermissions();
		 if(res) setPermissionGranted(true)
	}
}

// TODO: Once app is finalized this method will not be needed.
export function getRuntimeEngine() {
	switch (Constants.executionEnvironment) {
		case ExecutionEnvironment.StoreClient: return 'expoGo'
		case ExecutionEnvironment.Bare: return 'reactNative'
	}
}
