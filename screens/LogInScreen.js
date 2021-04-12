  import React, {useState, useRef} from 'react';
  import {View,Text,Alert,StyleSheet,Modal,TouchableWithoutFeedback,Keyboard,ImageBackground,TouchableOpacity} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import StatusCodes from "../utils/StatusCodes.json";
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as authActions from '../store/auth-actions';
  import * as userActions from '../store/user-actions';
  import {useDispatch} from 'react-redux';
  import TermsAndConditions from '../screens/TermsAndConditions';
  import Privacy from '../screens/Privacy';

  //Login Screen
  const LogInScreen = props => {

  const dispatch = useDispatch();

  //State Variables
  const [MSISDN, setMSISDN] = useState("");
  const [isValidMSISDN, setIsValidMSISDN] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isValidOTP, setIsValidOTP] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalForScreenVisible, setModalForScreenVisible] = useState(false);
  const [retryOtpTimer, setRetryOtpTimer] = useState(30);
  const [retryTimerId, setRetryTimerId] = useState(null);
  const [screenName, setScreenName] = useState("");

  const timerRef=useRef(null);

  //Get OTP event handler
  const onClickGetOTP = () => {
    dispatch(authActions.generateOTPForMSISDN(MSISDN)).then(response => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {}
        }], {
          cancelable: false
        });
      } else if (response.status !== StatusCodes.OK) {
        Alert.alert("Try Again", "Please try again later!!!", [{
          text: 'OK',
          onPress: () => {}
        }], {
          cancelable: false
        });
      } else {
        setModalVisible(true);
        //Update Retry Timer each second to display on screen, once timer is started
        var intervalId = setInterval(() => updateRetryTimer(), 1000);
        setRetryTimerId(intervalId);
        timerRef.current=setTimeout(() => {
          setModalVisible(false);
          setOtpCode("");
          setRetryOtpTimer(30);
          clearInterval(retryTimerId);
        }, 30000);
      }
    });
  };

  // Update Retry Timer hook
  const updateRetryTimer = () => {
    setRetryOtpTimer((prevState) => {
      return prevState - 1;
    });
  };

  //Submit OTP event handler
  const onClickSubmitOTP = () => {
    dispatch(authActions.validateOTPForMSISDN(MSISDN, otpCode)).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        setOtpCode("");
        dispatch(cleanUserData());
        clearInterval(retryTimerId);
        clearTimeout(timerRef.current);
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setRetryOtpTimer(30);
          }
        }], {
          cancelable: false
        });
      } else if (response.status !== StatusCodes.OK) {
        setOtpCode("");
        dispatch(cleanUserData());
        clearInterval(retryTimerId);
        clearTimeout(timerRef.current);
        Alert.alert("OTP Alert", "OTP Validation Failed please try again!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setRetryOtpTimer(30);
          }
        }], {
          cancelable: false
        });
      } else if (response.data.isValid) {
        clearInterval(retryTimerId);
        clearTimeout(timerRef.current);
        setModalVisible(false);
        loadUserDetailsAndNavigate();
      } else {
        setOtpCode("");
        clearInterval(retryTimerId);
        clearTimeout(timerRef.current);
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
    });
  };

  //Modal Closed Event Handler
  const onModalClosed = () => {
    clearInterval(retryTimerId);
    setOtpCode("");
    setRetryOtpTimer(30);
  };

  //Privacy & Terms & Conditions Item Handler
  const onClickTextItem = (selectedItem) => {
    setScreenName(selectedItem);
    setModalForScreenVisible(true);
  };

  //Privacy & Terms & Conditions Item Close Action Handler
  const onCloseScreenTextItem = () => {
    setScreenName("");
    setModalForScreenVisible(false);
  };

  //Load User Details from local or server and navigate either to User Details screen or Home Screen
  const loadUserDetailsAndNavigate = () => {
    dispatch(userActions.loadUserDetails()).then((userDetails) => {
      userDetails.status !== StatusCodes.OK || userDetails.data.userFirstName === null ? props.navigation.navigate('UserDetailsScreen') : props.navigation.navigate('Home');
    });
  };

  //Method to validate Phone Number Input
  const onChangeMSISDNHandler = (text) => {
    var phoneNumberRegex = /^\d{10}$/;
    setMSISDN(text);
    if (text.match(phoneNumberRegex)) {
      setIsValidMSISDN(true);
    } else {
      setIsValidMSISDN(false);
    }
  };

  //Method to validate OTP Input
  const onChangeOTPHandler = (text) => {
    var otpCodeRegex = /^\d{4}$/;
    setOtpCode(text);
    if (text.match(otpCodeRegex)) {
      setIsValidOTP(true);
    } else {
      setIsValidOTP(false);
    }
  };

  //Method to clean User Data in case of failure while validating OTP
  const cleanUserData = () => {
    return async dispatch => {
      await dispatch({
        type: 'CLEAN_USER_STATE'
      });
      await dispatch({
        type: 'CLEAN_AUTH_STATE'
      });
      await dispatch(userActions.cleanUpUserData());
    };
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
        
        <View style={styles.footerContainerStyle}>
         <Text style={styles.footerTextStyle}>            By signing in, you agree to our{"\n"} 
         <Text
         style={styles.hyperLinkTextStyle}
         onPress={()=>{onClickTextItem("terms")}}> Terms & Conditions </Text>
          and 
         <Text
         style={styles.hyperLinkTextStyle} 
         onPress={()=>{onClickTextItem("privacy")}}> Privacy Policy</Text>
         </Text>
        </View>

       </ImageBackground> 
      </TouchableWithoutFeedback>

      <Modal animationType = "slide"
       transparent = {false}
       visible = {modalForScreenVisible}
       onDismiss = {onModalClosed}
       onRequestClose = {() => {}
      }>
        {screenName==="terms"?(
         <TermsAndConditions onClose={onCloseScreenTextItem}></TermsAndConditions>
        ):
         (<Privacy onClose={onCloseScreenTextItem}></Privacy>)
        }
      </Modal>

      <Modal animationType = "slide"
       transparent = {false}
       visible = {modalVisible}
       onDismiss = {onModalClosed}
       onRequestClose = {() => {}
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
          onChangeText = {onChangeOTPHandler}>
         </TextInputItem> 
         <Text style = {styles.retryOtpTimerTextStyle}>Resend OTP in {retryOtpTimer} seconds < /Text>
         {!isValidOTP && otpCode.length>0 ? ( 
          <Text style = {styles.errorTextOtpStyle} > Please enter valid OTP < /Text>):
          (<Text/>)
         }
         <RoundButton style = {styles.buttonSubmitOtpStyle}
          title = "Submit"
          disabled = {(!isValidOTP || (otpCode.length === 0))}
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
      color: 'white',
      top: '42%',
      alignSelf: 'center',
      fontFamily: 'open-sans'
    },
    otpButtonStyle: {
      alignSelf: 'center',
      top: '45%'
    },
    footerContainerStyle: {
      alignSelf: 'center',
      borderRadius: 25,
      top: '50%',
      backgroundColor: 'black',
      opacity: 0.5
    },
    footerTextStyle: {
      fontSize: moderateScale(12, 0.8),
      color: 'white',
      padding: '2%',
      fontFamily: 'open-sans'
    },
    hyperLinkTextStyle: {
      fontSize: moderateScale(13, 0.8),
      color: 'white',
      fontFamily: 'open-sans-bold',
      textDecorationLine: 'underline'
    },

    otpModalContainerStyle: {
      marginTop: '10%'
    },
    otpInputStyle: {
      width: verticalScale(120),
      top: '90%'
    },
    retryOtpTimerTextStyle: {
      color: 'white',
      top: '35%',
      alignSelf: 'center',
      fontFamily: 'open-sans'
    },
    errorTextOtpStyle: {
      color: 'white',
      top: '90%',
      alignSelf: 'center',
      fontFamily: 'open-sans'
    },
    buttonSubmitOtpStyle: {
      alignSelf: 'center',
      top: '95%'
    }
  });

  export default LogInScreen;