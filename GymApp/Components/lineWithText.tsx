import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HorizontalLineWithText = (props: {text: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{props.text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
		marginBottom: -5
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3D3D3',
  },
  text: {
		margin: 10,
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#808080',
  },
});

export default HorizontalLineWithText;