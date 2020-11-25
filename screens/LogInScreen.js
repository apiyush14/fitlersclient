import React, { useState, useEffect} from 'react';
import { View, Text,TextInput, StyleSheet,Dimensions,Modal} from 'react-native';
import RoundButton from '../components/RoundButton';
import * as authActions from '../store/auth-actions';
import {useDispatch,useSelector} from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LogInScreen = props=>{

const dispatch=useDispatch();

const [MSISDN,setMSISDN]=useState("");
const [otpCode,setOtpCode]=useState("");
const [modalVisible,setModalVisible]=useState(false);

const onClickGetOTP=()=>{
 dispatch(authActions.generateOTPForMSISDN(MSISDN));
 setModalVisible(true);
}; 

const onClickSubmitOTP=()=>{
 dispatch(authActions.validateOTPForMSISDN(MSISDN,otpCode));
 setModalVisible(false);
}; 

return (
  <View style={styles.logInScreenContainer}>
   <Text>Enter Mobile Number</Text>
   <TextInput style={styles.contactNumberInput}
    textContentType="telephoneNumber"
    keyboardType="phone-pad"
    maxLength= {10}
    onChangeText={(text)=>setMSISDN(text)}>
   </TextInput>
   <RoundButton 
   style={styles.buttonGetOTP}
   title="Get OTP"
   onPress={onClickGetOTP}
   />
   <Modal 
   animationType="slide" 
   transparent={false} 
   visible={modalVisible}
   onRequestClose={()=>{}}>
   <View style={styles.otpModalContainer}>
    <Text>Enter OTP</Text>
   <TextInput style={styles.otpInput}
    keyboardType="number-pad"
    maxLength= {4}
    onChangeText={(text)=>setOtpCode(text)}>
   </TextInput>
   <RoundButton 
   style={styles.buttonSubmit}
   title="Submit"
   onPress={onClickSubmitOTP}/>
   </View>
  </Modal>
  </View>
 );
};

const styles = StyleSheet.create({
logInScreenContainer: {
  flex: 1,
  flexDirection: 'column'
},
contactNumberInput: {
  backgroundColor: 'white',
  height: '8%',
  width: '50%',
  alignSelf: 'center'
},
buttonGetOTP: {
  marginTop: '5%',
  alignSelf: 'center'
},
otpModalContainer: {
  marginTop: '10%',
  backgroundColor: 'lightgrey'
},
otpInput: {
  backgroundColor: 'white',
  height: '20%',
  width: '30%',
  alignSelf: 'center'
},
buttonSubmit: {
  marginTop: '5%',
  alignSelf: 'center'
}
});

export default LogInScreen;