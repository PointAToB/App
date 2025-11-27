import { codegenNativeComponent, type ViewProps } from 'react-native';


interface NativeProps extends ViewProps {
  captureMode: string,
  cameraLens: string
}

export default codegenNativeComponent<NativeProps>('RnPotatoView');