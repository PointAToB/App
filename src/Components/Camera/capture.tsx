import { View, Pressable, StyleSheet } from "react-native";
import React, { ComponentType } from "react";
import { Option } from './captureOptions'

type Props = {
  option: Option,
  size: number,
  onPress: ()=>void
}

const Capture = (props: Props) => {
  const {option, size, onPress} = props
	return (
		<Pressable onPress={onPress} style={{width: size, height: size, borderRadius: (size/2), alignItems: 'center', marginTop: 10, backgroundColor: 'white'}}>
			<View style={[styles.innerCircle, {backgroundColor: option.captureColor, width: (size - 4), height: (size - 4), borderRadius: (size - 4)/2, borderWidth: 2, borderStyle: 'solid', borderColor: 'black'}]}/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	innerCircle: {
		position: 'relative',
		top: 2,
		bottom: 0,
		left: 0,
		right: 0
	}
})
export default  Capture;