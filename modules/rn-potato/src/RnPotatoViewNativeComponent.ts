import { codegenNativeComponent, type ViewProps, CodegenTypes, codegenNativeCommands, HostComponent } from 'react-native';

interface NativeProps extends ViewProps {
  captureMode: string,
  cameraLens: string,
  onCapture: CodegenTypes.BubblingEventHandler<{success: boolean}>
}

interface NativeCommands {
  capture: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void,
  propose: (viewRef: React.ElementRef<HostComponent<NativeProps>>, accepted: boolean) => void
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['capture', 'propose']
});

export default codegenNativeComponent<NativeProps>('RnPotatoView');