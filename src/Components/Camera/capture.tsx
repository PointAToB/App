import Icon from '@expo/vector-icons/FontAwesome';
import { View, Pressable, StyleSheet } from "react-native";
import React from "react";


const Capture = (props: {type: string, size: number, onPress?: ()=>{}}) => {
	// Based on type (photo, video, coach)
	let innerColor = 'white'
	if(props.type === 'Video') innerColor = '#DD1C1A'
	if(props.type === 'Coach') innerColor = '#003D5B'

	return (
		<Pressable onPress={props.onPress} style={{width: props.size, height: props.size, borderRadius: (props.size/2), alignItems: 'center', marginTop: 10, backgroundColor: 'white'}}>
			<View style={[styles.innerCircle, {backgroundColor: innerColor, width: (props.size - 4), height: (props.size - 4), borderRadius: (props.size - 4)/2, borderWidth: 2, borderStyle: 'solid', borderColor: 'black'}]}/>
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