import Icon from '@expo/vector-icons/Ionicons';
import {Pressable, ViewStyle} from 'react-native';
import {CameraType} from "expo-camera";

export default function Toggle(props: {size: number, cameraType: string, setCameraType: (cameraType: CameraType)=>void, color: string, style?: ViewStyle | undefined}) {
	const toggle = () => props.setCameraType(props.cameraType === 'back' ? 'front' : 'back')
	return (
		<Pressable onPress={toggle} style={[props.style, {width: props.size, height: props.size}]}>
			<Icon name='sync-circle' size={props.size} color={props.color}/>
		</Pressable>
	);
}