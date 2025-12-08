import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { MediaStreamView } from 'rn-potato'
import Close from "./close";
import { useState } from "react";

export default function Summary(props: {summary: boolean, setSummary: ()=>void, mode: string}) {
  const [openView, setOpenView] = useState(false)
  const backgroundColor = '#334E58'

  return (
    <Modal animationType='slide' visible={props.summary}>
      <View style={[styles.main, {backgroundColor: backgroundColor}, (openView ? {flexDirection: 'col'} : {flexDirection: 'row'})]}>
        <Pressable onPress={()=>setOpenView(true)}>
          <MediaStreamView style={(openView ? styles.main : [styles.closeView, {height: '50%'}])} mode={props.mode} color={backgroundColor}></MediaStreamView>
        </Pressable>

        <View style={styles.sideContainer}>
          <Text style={styles.bold}>Workout Name: </Text>
          <Text style={styles.text}>Workout Name</Text>
          <Text style={styles.bold}>Description: </Text>
          <Text style={styles.text}>Description</Text>

          <Text style={styles.bold}>Sets: </Text>
          <Text style={styles.text}>0</Text>
          <Text style={styles.bold}>Reps: </Text>
          <Text style={styles.text}>0</Text>
        </View>
        <Close size={34} onPress={()=>{openView ? setOpenView(false) : props.setSummary(false)}} style={{position: 'absolute', right: 25, top: 25, color: 'white'}}/>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
	main: {
		width: '100%',
		height: '100%',
    display: 'flex',
	},
  sideContainer: {
    height: '50%',
    flex: 1,
    marginRight: 25,
    paddingTop: 25,
    paddingBottom: 25
  },
  bottomContainer: {
    backgroundColor: 'red',
  },
  text: {
    fontSize: 20
  },
  bold: {
    fontWeight: 'bold'.style,
    fontSize: 25
  },
  openView: {
    width: '100%',
    height: '100%',
  },
  closeView: {
    aspectRatio: 3/4
  }
});