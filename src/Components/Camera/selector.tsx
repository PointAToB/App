import {FlatList, Text, View, StyleSheet, Dimensions} from "react-native";
import Capture from "./capture";
import { selectable } from './selectable'

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 100; // Width of each item
const MARGIN = 36;
const SPACING = (screenWidth - ITEM_WIDTH) / 2 - MARGIN;

type Props = {options: selectable[], selected: number, setSelect: (index: number)=>void, onPress: ()=>void}

export default function Selector(props: Props) {
	const {options, selected, setSelect, onPress} = props;
	const optionsStr: string[] = options.map((element) => element.displayName!)

	const handleSelection = (event: any) => {
		const offset: number = event.nativeEvent.contentOffset.x
		const index: number = Math.round(offset / ITEM_WIDTH)
		setSelect(index)
	}
	return (
		<View>
			<FlatList
				maxToRenderPerBatch={1}
				style={styles.selector}
				data={optionsStr}
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={ITEM_WIDTH}
				decelerationRate='normal'
				initialScrollIndex={1}
				contentContainerStyle={{ paddingHorizontal: SPACING}}
				getItemLayout={(_, index) => ({
					length: ITEM_WIDTH,
					offset: ITEM_WIDTH * index,
					index,
				})}
				renderItem={({ item, index }) => (
					<View style={[styles.item, { width: ITEM_WIDTH }]}>
						<Text style={styles.text}>{item}</Text>
						<Capture component={props.options[index]} size={48} onPress={()=>(index === selected) ? onPress() : null}/>
					</View>
				)}
				keyExtractor={(index) => index.toString()}
				onMomentumScrollEnd={handleSelection}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
 item: {
    height: 90,
	 	alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
	selector: {
		position: 'absolute',
		left: MARGIN,
		right: MARGIN
	},
});