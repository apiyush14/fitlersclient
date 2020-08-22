import React from 'react';
import { StyleSheet, View } from 'react-native';

/*
Card component with shadow effects
*/
const Card=props=>{
	return <View style={{...styles.card,...props.style}}>{props.children}</View>
};

const styles = StyleSheet.create({
  card: {
     padding:10,
     shadowColor: 'grey',
     shadowOffset: {width:0,height:2},
     shadowOpacity:1,
     shadowRadius:6,
     backgroundColor: 'white',
     borderRadius: 10
  },
});

export default Card;