import { Alert } from "react-native";
import { useEffect } from "react";
import { Camera as expoCamera, PermissionResponse } from "expo-camera";

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
	const res: PermissionResponse = await expoCamera.requestCameraPermissionsAsync();
	if(res.status && res.granted) setPermissionGranted(true);
}

