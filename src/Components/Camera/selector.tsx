import {FlatList, Text, View, StyleSheet, Dimensions} from "react-native";
import Capture from "./capture";
import { CameraType } from "expo-camera";
import { ComponentType } from "react";

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 100; // Width of each item
const MARGIN = 36;
const SPACING = (screenWidth - ITEM_WIDTH) / 2 - MARGIN;


export default function Selector(props: {options: ComponentType<{cameraType: CameraType}>[], setSelection: (index: number)=>void}) {
	const optionsStr: string[] = props.options.map((element) => element.displayName!)

	const handleSelection = (event: any) => {
		const offset: number = event.nativeEvent.contentOffset.x
		const index: number = Math.round(offset / ITEM_WIDTH)
		props.setSelection(index)
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
						<Capture type={optionsStr[index]} size={48}/>
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