import Icon from '@expo/vector-icons/Ionicons';
import {Pressable, ViewStyle} from 'react-native';

export default function Close(props: {size: number, cameraType: string, setDisplay: (display: string)=>void, color: string, style?: ViewStyle | undefined}) {
	const close = () => props.setDisplay('close')
	return (
		<Pressable onPress={close} style={[props.style, {width: props.size, height: props.size}]}>
			<Icon name='close-circle-sharp' size={props.size} color={props.color}/>
		</Pressable>
	);
}