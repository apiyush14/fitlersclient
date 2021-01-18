  import React, {useState} from 'react';
  import {View,Text,Alert,StyleSheet,Modal,TouchableWithoutFeedback,Keyboard,ImageBackground} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as authActions from '../store/auth-actions';
  import {useDispatch} from 'react-redux';

  //Login Screen
  const LogInScreen = props => {

      const dispatch = useDispatch();

      //State Variables
      const [MSISDN, setMSISDN] = useState("");
      const [isValidMSISDN, setIsValidMSISDN] = useState(true);
      const [otpCode, setOtpCode] = useState("");
      const [modalVisible, setModalVisible] = useState(false);
      const [retryOtpTimer, setRetryOtpTimer] = useState(30);
      const [retryTimerId, setRetryTimerId] = useState(null);

      const onChangeMSISDNHandler = (text) => {
        var phoneNumberRegex = /^\d{10}$/;
        if (text.match(phoneNumberRegex)) {
          setIsValidMSISDN(true);
          setMSISDN(text);
        } else {
          setIsValidMSISDN(false);
        }
      };

      const onClickGetOTP = () => {
        dispatch(authActions.generateOTPForMSISDN(MSISDN)).then(response => {
          setModalVisible(true);
          var intervalId = setInterval(() => updateRetryTimer(), 1000);
          setRetryTimerId(intervalId);
          setTimeout(() => {
            setModalVisible(false);
            setOtpCode("");
            setRetryOtpTimer(30);
            clearInterval(retryTimerId);
          }, 30000);
        }).catch(err => {
          if (err === 201) {
            Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
              text: 'OK',
              onPress: () => {}
            }], {
              cancelable: false
            });
          } else {
            Alert.alert("Try Again", "Please try again later!!!", [{
              text: 'OK',
              onPress: () => {}
            }], {
              cancelable: false
            });
          }
        });
      };

      const updateRetryTimer = () => {
        setRetryOtpTimer((prevState) => {
          return prevState - 1;
        });
      };

      const onClickSubmitOTP = () => {
        dispatch(authActions.validateOTPForMSISDN(MSISDN, otpCode)).then((response) => {
          var isLoginPassed = response.isValid;
          if (isLoginPassed === true) {
            clearInterval(retryTimerId);
            props.navigation.navigate('UserDetailsScreen');
          } else {
            setOtpCode("");
            clearInterval(retryTimerId);
            Alert.alert("OTP Alert", "Incorrect OTP please try again!!!", [{
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                setRetryOtpTimer(30);
              }
            }], {
              cancelable: false
            });
          }
        }).catch(err => {
          setOtpCode("");
          AsyncStorage.removeItem('USER_ID');
          clearInterval(retryTimerId);
          if (err === 201) {
            Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                setRetryOtpTimer(30);
              }
            }], {
              cancelable: false
            });
          } else {
            Alert.alert("OTP Alert", "OTP Validation Failed please try again!!!", [{
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                setRetryOtpTimer(30);
              }
            }], {
              cancelable: false
            });
          }
        });
      };

      const onModalClosed = () => {
        clearInterval(retryTimerId);
        setOtpCode("");
        setRetryOtpTimer(30);
      };

    return ( 
      <View style = {styles.logInScreenContainerStyle}>
       <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false} >
        <ImageBackground source = {require('../assets/images/login.jpg')} 
        style = {styles.bgImageStyle}>
        <TextInputItem
         style = {styles.msisdnInputStyle}
         textContentType = "telephoneNumber"
         keyboardType = "phone-pad"
         placeholder = " Enter Your Mobile Number"
         textAlign = "center"
         textContentType = "telephoneNumber"
         maxLength = {10}
         onChangeText = {onChangeMSISDNHandler}>
        </TextInputItem> 
         {!isValidMSISDN && MSISDN.length>0 ? ( 
          <Text style = {styles.errorTextStyle} > Please enter valid phone number < /Text>):
          (<Text/>)
         }

        <RoundButton style = {styles.otpButtonStyle}
         title = "Get OTP"
         disabled = {(!isValidMSISDN || (MSISDN.length === 0))}
         onPress = {onClickGetOTP}
        /> 
       </ImageBackground> 
      </TouchableWithoutFeedback>

      <Modal animationType = "slide"
       transparent = {false}
       visible = {modalVisible}
       onDismiss = {onModalClosed}
       onRequestClose = {() => {console.log('==========Modal closed================')}
      }>

      <TouchableWithoutFeedback onPress = {Keyboard.dismiss}
       accessible = {false}>
       <ImageBackground source = {require('../assets/images/login.jpg')}
        style = {styles.bgImageStyle}>
        <View style = {styles.otpModalContainerStyle}>
         <TextInputItem style = {styles.otpInputStyle}
          keyboardType = "number-pad"
          placeholder = "Enter OTP"
          textAlign = "center"
          textContentType = "oneTimeCode"
          maxLength = {4}
          onChangeText = {(text) => setOtpCode(text)} >
         </TextInputItem> 
         <Text style = {styles.retryOtpTimerTextStyle}>Resend OTP in {retryOtpTimer} seconds < /Text> 
         <RoundButton style = {styles.buttonSubmitOtpStyle}
          title = "Submit"
          disabled = {otpCode.length === 0}
          onPress = {onClickSubmitOTP}/> 
        </View> 
       </ImageBackground> 
      </TouchableWithoutFeedback> 
      </Modal> 
      </View>
    );
  };

  const styles = StyleSheet.create({
    logInScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column'
    },
    bgImageStyle: {
      flex: 1
    },

    msisdnInputStyle: {
      top: '40%'
    },
    errorTextStyle: {
      color: 'red',
      top: '42%',
      alignSelf: 'center',
    },
    otpButtonStyle: {
      alignSelf: 'center',
      top: '45%'
    },

    otpModalContainerStyle: {
      marginTop: '10%'
    },
    otpInputStyle: {
      width: verticalScale(120),
      top: '90%'
    },
    retryOtpTimerTextStyle: {
      color: 'red',
      top: '35%',
      alignSelf: 'center'
    },
    buttonSubmitOtpStyle: {
      alignSelf: 'center',
      top: '95%'
    }
  });

  export default LogInScreen;