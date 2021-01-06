import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';

/*
Card component with shadow effects
*/
const Card=props=>{
	return <View style={{...styles.card,...props.style}}>{props.children}</View>
};

const styles = StyleSheet.create({
  card: {
     marginTop: '1%',
     marginBottom: '1%',
     marginLeft: '1%',
     marginRight: '1%',
     backgroundColor: 'black',
     borderRadius: 10,
     height: verticalScale(125),
     width: scale(150),
     alignItems: 'center',
     flexDirection: 'column'
  },
});

export default Card;