import { codegenNativeComponent } from 'react-native';


export interface NativeProps extends ViewProps {
  mode: string
}

export default codegenNativeComponent<NativeProps>('MediaView');