import type {
    CodegenTypes,
    HostComponent,
    ViewProps,
    codegenNativeComponent
} from 'react-native';


export interface NativeProps extends ViewProps {
    onCapture?: CodegenTypes.DirectEventHandler<Readonly<{success: boolean}>>;
    suggestRetry: boolean;
    runningMode: string
}

export default codegenNativeComponent<NativeProps>(
    'CameraView',
) as HostComponent<NativeProps>;

