import React, {useState} from 'react';
import { StyleSheet, View, TextInput} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';

/*
Text Input Item
*/

const TextInputItem=props=>{

const [isFocussed,setIsFocussed] = useState(false);

//View
return(
   <View style={{...styles.textInputContainerStyle,...props.style}}>
    <TextInput style = {isFocussed?styles.textInputStyleFocussed:styles.textInputStyleBlurred}
       textContentType = {props.textContentType}
       keyboardType = {props.keyboardType}
       placeholder = {props.placeholder}
       placeholderTextColor = {props.placeholderTextColor}
       textAlign = {props.textAlign}
       textContentType = {props.textContentType}
       maxLength = {props.maxLength}
       multiline = {props.multiline}
       onBlur = {()=>setIsFocussed(false)}
       onFocus = {()=>setIsFocussed(true)}
       onChangeText = {props.onChangeText}>
     </TextInput> 
   </View>
 	);
};

const styles = StyleSheet.create({
  textInputContainerStyle: {
    height: verticalScale(60),
    width: verticalScale(250),
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30
  },
  textInputStyleBlurred: {
     height: '100%',
     width: '100%',
     borderRadius: 30
  },
  textInputStyleFocussed: {
    height: '100%',
    width: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'royalblue'
  }
});

export default TextInputItem;