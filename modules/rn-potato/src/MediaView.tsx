import { View, ViewStyle, StyleSheet } from 'react-native'
import MediaView from './MediaViewNativeComponent';

export function MediaStreamView(props: {color: string, mode: string, style?: ViewStyle}) {
  return (
    <View style={props.style}>
      <MediaView style={{flex: 1, margin: 10}} mode={props.mode}></MediaView>
      <View style={[styles.main, {borderColor: props.color}]}/>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderWidth: 25,
      borderRadius: 35
  }
})



export * from './MediaViewNativeComponent';