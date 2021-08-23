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

  //TO BE Removed
  import {NativeModules,NativeEventEmitter} from 'react-native';
  import GoogleFitRunsList from '../components/GoogleFitRunsList';
  import RunDetails from '../models/rundetails';

  //Login Screen
  const LogInScreen = props => {


  //TO BE REMOVED
  var GoogleFitJavaModule=NativeModules.GoogleFitJavaModule;

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

  //TO BE REMOVED
  const [modalGoogleFitVisible, setModalGoogleFitVisible] = useState(false);
  const [runHistory, setRunHistory]=useState([]);

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

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
        setRetryOtpTimer(30);
        setModalVisible(true);
        clearInterval(retryTimerId);
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

  //TO BE REMOVED
  const onClickTest = () =>{
    //GoogleFitJavaModule.fetchAllActivityForToday((response)=>{
     var response={"1628046344418":{"distance":"203.4629","endTime":"1628086773318","startTime":"1628048285333"},"1628045339849":{"distance":"1076.96","endTime":"1628046344418","startTime":"1628045339849"},"1628044822014":{},"1628042219988":{"distance":"3543.12","endTime":"1628044822014","startTime":"1628042219988"},"1628014594000":{"distance":"36.47","endTime":"1628041446794","startTime":"1628041405972"}};
     var responseMap=new Map(Object.entries(response));
     var responseKeys=Object.keys(response);
     //console.log(responseMap.get(responseKeys[0]));
     runHistory.length=0;

     for(var j=0;j<responseKeys.length;j++){
      var responseKey=responseKeys[j];
      //console.log(responseKey);
      var bucketMap=new Map(Object.entries(responseMap.get(responseKey)));
      var keys=Array.from(bucketMap.keys());
      var distance=0.0;
      var startTime=0;
      var endTime=0;
            for(var i=0;i<keys.length;i++){
                 var currentKey=keys[i];
                 console.log(currentKey);
                 if(currentKey==="distance"){
                    distance=parseFloat(bucketMap.get(currentKey));
                 }
                 else if(currentKey==="startTime"){
                    startTime=parseFloat(bucketMap.get(currentKey));
                 }
                 else if(currentKey==="endTime"){
                    endTime=parseFloat(bucketMap.get(currentKey));
                 }
            }
            if(distance>100){
            var runDateFromTime=new Date(startTime);
            var runDate = runDateFromTime.getDate() + "/" + parseInt(runDateFromTime.getMonth() + 1) + "/" + runDateFromTime.getFullYear();
            var runDay = weekday[runDateFromTime.getDay()];
            
            var runTotalTime=endTime-startTime;
            const lapsedTimeinMinutes = runTotalTime / 60000;
            const averagePace = lapsedTimeinMinutes / (distance / 1000);

            const lapsedTimeinHours = lapsedTimeinMinutes / 60;
            const averagePaceKmPerHour = (distance / 1000) / lapsedTimeinHours;
            const caloriesBurnt = parseInt((averagePaceKmPerHour * 3.5 * parseInt(69)) / 200) * lapsedTimeinMinutes;
            
            if(averagePaceKmPerHour<100){
             var runDetails=new RunDetails(startTime, runTotalTime, distance, averagePace, caloriesBurnt, 0, runDateFromTime.toJSON(), runDate, runDay, [], "", 0, "0");
             runHistory.push(runDetails);
           }
          }
     }
     console.log(runHistory);
     setModalGoogleFitVisible(true);

    /*GoogleFitJavaModule.fetchAllActivityForToday((response)=>{
      console.log(JSON.stringify(response));
      var run="{"1628046344418":{"distance":"203.4629","endTime":"1628086773318","startTime":"1628048285333"},"1628045339849":{"distance":"1076.96","endTime":"1628046344418","startTime":"1628045339849"},"1628044822014":{},"1628042219988":{"distance":"3543.12","endTime":"1628044822014","startTime":"1628042219988"},"1628014594000":{"distance":"36.47","endTime":"1628041446794","startTime":"1628041405972"}}";
      
      var responseMap=new Map(Object.entries(response));
      var updatedRuns=responseMap.map((bucket) => {
            var bucketMap=new Map(Object.entries(bucket));
            var keys=Object.keys(bucketMap);
            var distance="";
            var startTime="";
            var endTime="";
            for(var i=0;i<keys.length;i++){
                 var currentKey=keys[i];
                 if(currentKey==="distance"){
                    distance=bucketMap.get(currentKey);
                 }
                 else if(currentKey==="startTime"){
                    startTime=bucketMap.get(currentKey);
                 }
                 else if(currentKey==="endTime"){
                    endTime=bucketMap.get(currentKey);
                 }
            }
            return new RunDetails(startTime, endTime, distance, "0", "0", "0", startTime, "", "", "", "", "", "0");
      })
      var updatedRuns = response.map((run) => {
                  console.log(run);
                  return new RunDetails(run.startTime, run.endTime-run.startTime, run.distance, "0", "0", "0", run.startTime, "", "", "", "", "", "0");
            });
      console.log(updatedRuns);*/
    //});
  };

    //TO BE REMOVED
  const onClickTest1 = () =>{
    GoogleFitJavaModule.signInToGoogleFit((response)=>{
      console.log(response);
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
          
         <RoundButton style = {styles.buttonTestStyle}
          title = "Test"
          onPress = {onClickTest}/>

          <RoundButton style = {styles.buttonTest1Style}
          title = "Fit"
          onPress = {onClickTest1}/>

          <Modal animationType = "slide"
           transparent = {false}
           visible = {modalGoogleFitVisible}
           onDismiss = {onModalClosed}
           onRequestClose = {() => {}}>
           <View style={styles.runHistoryContainerStyle}>
    <GoogleFitRunsList
     listData={runHistory}
     onEndReached={()=>{}}
     onSelectRunItem={()=>{}}
     />
   </View>
           
      </Modal>
        
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
      fontSize: moderateScale(12, 0.8),
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
    },

    buttonTestStyle: {
      alignSelf: 'center',
      top: '50%'
    },
    buttonTest1Style: {
      top: '50%'
    },
    runHistoryContainerStyle: {
      flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: '2%'
    }

  });

  export default LogInScreen;