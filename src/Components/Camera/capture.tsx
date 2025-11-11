import { View, Pressable, StyleSheet } from "react-native";
import React, { ComponentType } from "react";
import { selectable } from './selectable'


const Capture = (props: {component: selectable, size: number, onPress?: ()=>void}) => {
	return (
		<Pressable onPress={props.onPress} style={{width: props.size, height: props.size, borderRadius: (props.size/2), alignItems: 'center', marginTop: 10, backgroundColor: 'white'}}>
			<View style={[styles.innerCircle, {backgroundColor: props.component.captureColor, width: (props.size - 4), height: (props.size - 4), borderRadius: (props.size - 4)/2, borderWidth: 2, borderStyle: 'solid', borderColor: 'black'}]}/>
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