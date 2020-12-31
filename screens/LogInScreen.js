  import React, {
    useState
  } from 'react';
  import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground
  } from 'react-native';
  import RoundButton from '../components/RoundButton';
  import * as authActions from '../store/auth-actions';
  import {
    useDispatch
  } from 'react-redux';

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  //Login Screen
  const LogInScreen = props => {

    const dispatch = useDispatch();

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
        //console.log('===============Updating Timer===================');
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
      <View style = {styles.logInScreenContainer}>
       <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false} >
       <ImageBackground source = {require('../assets/images/login.jpg')} 
       style = {styles.bgImage}>
      <TextInput style = {styles.contactNumberInput}
       textContentType = "telephoneNumber"
       keyboardType = "phone-pad"
       placeholder = " Enter Your Mobile Number"
       textAlign = "center"
       textContentType = "telephoneNumber"
       maxLength = {10}
       onChangeText = {onChangeMSISDNHandler}>
      </TextInput> 
      {
        !isValidMSISDN ? ( 
        <Text style = {styles.errorTextMSISDN} > Please enter valid phone number < /Text>):
        (<Text/>)
      } 
      <RoundButton style = {styles.buttonGetOTP}
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
      style = {styles.bgImage}>
      <View style = {styles.otpModalContainer}>
      <TextInput style = {styles.otpInput}
      keyboardType = "number-pad"
      placeholder = "Enter OTP"
      textAlign = "center"
      textContentType = "oneTimeCode"
      maxLength = {4}
      onChangeText = {(text) => setOtpCode(text)} >
      </TextInput> 
      <Text style = {styles.retryOtpTimerText}>Resend OTP in {retryOtpTimer}seconds < /Text> 
      <RoundButton style = {styles.buttonSubmit}
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
    logInScreenContainer: {
      flex: 1,
      flexDirection: 'column'
    },
    bgImage: {
      flex: 1
    },
    contactNumberInput: {
      backgroundColor: 'white',
      height: '8%',
      width: '50%',
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: 'lightblue',
      top: '40%'
    },
    errorTextMSISDN: {
      color: 'red',
      top: '40%',
      marginTop: '2%',
      alignSelf: 'center'
    },
    buttonGetOTP: {
      marginTop: '5%',
      alignSelf: 'center',
      top: '40%'
    },
    otpModalContainer: {
      marginTop: '10%'
    },
    otpInput: {
      backgroundColor: 'white',
      height: '20%',
      width: '30%',
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: 'lightblue',
      top: '80%'
    },
    retryOtpTimerText: {
      color: 'red',
      top: '40%',
      marginTop: '2%',
      alignSelf: 'center'
    },
    buttonSubmit: {
      marginTop: '5%',
      alignSelf: 'center',
      top: '90%'
    }
  });

  export default LogInScreen;