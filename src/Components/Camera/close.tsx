import Icon from '@expo/vector-icons/Ionicons';
import {Pressable, ViewStyle} from 'react-native';

export default function Close(props: {size: number, onPress: ()=>void, color: string, style?: ViewStyle | undefined}) {
	return (
		<Pressable onPress={props.onPress} style={[props.style, {width: props.size, height: props.size}]}>
			<Icon name='close-circle-sharp' size={props.size} color={props.color}/>
		</Pressable>
	);
}