import React from 'react';
import { StyleSheet,View,Button} from 'react-native';

const RoundButton=props=>{
	return (<View style={{...styles.button,...props.style}}>
            <Button title={props.title} onPress={props.onPress}>
           </Button>
         </View>
);
};

const styles = StyleSheet.create({
  button: {
     backgroundColor: 'black',
     width: 90,
     height: 90,
     borderRadius: 90/2,
     opacity: 0.7,
     justifyContent: 'center'
  },
});

export default RoundButton;