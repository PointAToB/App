import RnPotatoView, { Commands} from './RnPotatoViewNativeComponent';
import { View, ViewStyle, Button } from 'react-native'
import { useImperativeHandle, useRef } from 'react';
import React from 'react';

export type CameraMode = 'video' | 'image' | 'live'
export type CameraLens = 'front' | 'back'
export type CameraRef = {
  capture: ()=>void,
  propose: (accepted: boolean)=>void
}

export function CameraView(props: {lens: CameraLens, mode: CameraMode, style?: ViewStyle, ref}) {
  const innerRef = useRef<React.ElementRef<typeof View> | null>(null)
  useImperativeHandle(props.ref, ()=>({
    capture: () => { if(innerRef.current) Commands.capture(innerRef.current) },
    propose: (accepted: boolean)=> { if(innerRef.current) Commands.propose(innerRef.current, accepted)}
  }))

  return (
    <View style={props.style}>
      <RnPotatoView ref={innerRef} onCapture={(event)=>console.log("Capture button pressed")} captureMode={props.mode} cameraLens={props.lens} style={{flex: 1}}/>
    </View>
  );
}

export * from './RnPotatoViewNativeComponent';