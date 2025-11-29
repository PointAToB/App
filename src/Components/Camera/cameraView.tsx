import { RnPotatoView } from 'rn-potato'
import { View, ViewStyle } from 'react-native'

type Mode = 'video' | 'image' | 'live'
type Lens = 'front' | 'back'


export function CameraView(props: {lens: Lens, mode: Mode, style?: ViewStyle}) {

  return (
    <View style={props.style}>
      <RnPotatoView captureType={props.mode} cameraLens={props.lens} style={{flex: 1}}/>
    </View>
  );
}


