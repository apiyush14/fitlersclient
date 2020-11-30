import React from 'react';
import { StyleSheet,View,Text,TouchableOpacity,Dimensions} from 'react-native';

/*
Round Shaped Button
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RoundButton=props=>{
	return (<TouchableOpacity style={{...styles.button,...props.style}} onPress={props.onPress} disabled={props.disabled}>
            <Text style={styles.buttonTitle}>{props.title}</Text>
         </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  button: {
     backgroundColor: 'black',
     width: 90,
     height: 90,
     borderRadius: 90/2,
     opacity: 0.7,
     justifyContent: 'center',
     alignItems: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: windowWidth/21
  }
});

export default RoundButton;