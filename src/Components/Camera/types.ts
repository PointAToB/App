import { FC, RefObject } from "react";
import { CameraType } from "expo-camera";

// CameraFunctions
export type CameraFunctions = {
	capture: ()=>Promise<void>
}

// Adds captureColor attribute
export type CameraComponent = FC<{ cameraType: CameraType, ref: RefObject<CameraFunctions | null> }> & {
  captureColor: string;
};

// For CameraView Component
export type CameraViewComponent = {
	cameraType: CameraType,
	ref: RefObject<CameraFunctions | null>,
	Component: CameraComponent
}





