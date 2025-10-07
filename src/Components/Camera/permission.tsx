import { Alert } from "react-native";
import { useEffect, useState } from "react";

// TODO: Remove imports when app is finalized
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Camera } from "expo-camera";


export default function Permission(props: {setPermissionGranted: (permissionGranted: boolean)=>void, permissionGranted: boolean,
	displayCamera: boolean, isCameraDisplayed: (displayCamera: boolean)=>void}) {

  useEffect(() => {
		if (!props.permissionGranted && props.displayCamera) {
			Alert.alert(
				"Camera Access",
				"We need your permission to enable camera access",
				[
					{text: "Cancel", onPress: ()=>props.isCameraDisplayed(false), style: "cancel"},
					{text: "OK", onPress: ()=>{
							//setShowAlert(false)
							permissionHandler(props.setPermissionGranted)
						}},
				],
				{cancelable: true}
			);
		}
	}, [props.displayCamera]);
	return null;
}


// TODO: This method handles the permissions of camera between the runtimes of expo go and react native.
// TODO: When app is finalized simplify permissionHandler function to use react native permissions exclusively.
async function permissionHandler(setPermissionGranted: (permissionGranted: boolean)=>void) {
	if(getRuntimeEngine() === 'expoGo') {
		 await Camera.requestCameraPermissionsAsync();
		 setPermissionGranted(true)
	}

}

// TODO: Once app is finalized this method will not be needed.
// returns either expoGo or reactNative
export function getRuntimeEngine() {
	switch (Constants.executionEnvironment) {
		case ExecutionEnvironment.StoreClient:
			return 'expoGo'

		case ExecutionEnvironment.Bare:
			return 'reactNative'
	}
}
