import { Alert, Platform } from "react-native";
import { useEffect } from "react";
import { request, PERMISSIONS, RESULTS, Permission as Perm} from "react-native-permissions";
import { Camera as rnCamera} from "react-native-vision-camera";

// React native permission request function
async function requestNativeCameraPermissions() {
	// Short-handed type Permission as Perm to prevent naming issues with Permission component.
	let permission: Perm;

	if (Platform.OS === 'ios') permission = PERMISSIONS.IOS.CAMERA;
	else if (Platform.OS === 'android') permission = PERMISSIONS.ANDROID.CAMERA;
	else { console.warn('Unsupported platform'); return; }

	return  RESULTS.GRANTED === await request(permission)
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
	if(getRuntimeEngine() === 'expoGo') {
		 const res: PermissionResponse = await expoCamera.requestCameraPermissionsAsync();
		 if(res.status && res.granted) setPermissionGranted(true);
	}

	else if(getRuntimeEngine() === 'reactNative') {
		 const res = await rnCamera.requestCameraPermission()
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
