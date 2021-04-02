import React from 'react';
import { StyleSheet,Text,TouchableOpacity} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';

/*
Round Shaped Button
*/

//View
const RoundButton=props=>{
	return (
    <TouchableOpacity style={{...styles.buttonStyle,...props.style}} onPress={props.onPress} disabled={props.disabled}>
        <Text style={styles.buttonTitleStyle}>{props.title}</Text>
    </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: 'black',
    width: verticalScale(90),
    height: verticalScale(90),
    borderRadius: verticalScale(90 / 2),
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitleStyle: {
    color: 'white',
    fontSize: moderateScale(18, 0.8),
    fontFamily: 'open-sans'
  }
});

export default RoundButton;