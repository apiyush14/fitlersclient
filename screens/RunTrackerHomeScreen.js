import React, {useState,useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View,StyleSheet,Alert,Modal,ImageBackground,Text,PermissionsAndroid,Platform,NativeModules,TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import RoundButton from '../components/RoundButton';
import {useDispatch,useSelector} from 'react-redux';
import {useIsFocused} from "@react-navigation/native";
import * as runActions from '../store/run-actions';
import * as eventActions from '../store/event-actions';
import StatusCodes from "../utils/StatusCodes.json";
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import {Ionicons} from '@expo/vector-icons';
import configData from "../config/config.json";

import ChallengeList from '../components/ChallengeList';
import EventView from '../components/EventView';

import SettingsScreen from '../screens/SettingsScreen';
import GoogleFitRunsList from '../components/GoogleFitRunsList';
import RunDetails from '../models/rundetails';

var DistanceCalculatorModule=NativeModules.DistanceCalculatorModule;
var GoogleFitJavaModule=NativeModules.GoogleFitJavaModule;

const RunTrackerHomeScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isMoreContentAvailableOnServer, setIsMoreContentAvailableOnServer] = useState(true);

  // State Selectors
  const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails).filter(event => event.runId === 0);
  const eventDetails = useSelector(state => state.events.eventDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const runsHistoryList = useSelector(state => state.runs.runs);
  const pendingRunsForSync = useSelector(state => state.runs.runs.filter(run => run.isSyncDone === "0"));
  const userDetails = useSelector(state => state.userDetails);
  // State Variables
  const [mapRegion, setMapRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventDetails, setModalEventDetails] = useState(null);
  const [ongoingEventDetails, setOngoingEventDetails] = useState(null);


  //Google Fit
  const [googleFitModalVisible, setGoogleFitModalVisible] = useState(false);
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [runHistory, setRunHistory]=useState([]);

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  // Use Effect Hook to be loaded everytime the screen loads
  useEffect(() => {
    if (isFocused) {
      setIsMoreContentAvailableOnServer(true);
      setOngoingEventDetails(null);
      checkAndUpdateOngoingEvent();
      if (pendingRunsForSync !== null && pendingRunsForSync.length > 0) {
        dispatch(runActions.syncPendingRuns(pendingRunsForSync));
      }
    }
  }, [props, isFocused]);

  //Async Load User Data upon initialization
  useEffect(() => {
    const fetchData = async () => {
      dispatch(runActions.loadRuns());
      dispatch(runActions.loadRunSummary());
      dispatch(eventActions.loadEventsFromServer(0));
      dispatch(eventActions.loadEventRegistrationDetails());
      dispatch(eventActions.loadEventResultDetailsFromServer(0));
    }
    fetchData();
  }, []);

  //Load Location Details
  useEffect(() => {
    (async () => {
      await requestActivityRecognitionPermission();
      Location.requestForegroundPermissionsAsync().then(response => {
        if (response.status === 'granted') {
          Location.hasServicesEnabledAsync().then(response => {
            if (response) {
              Location.getCurrentPositionAsync({}).then(response => {
                setMapRegion({
                  latitude: response.coords.latitude,
                  longitude: response.coords.longitude,
                  latitudeDelta: 0.000757,
                  longitudeDelta: 0.0008
                });
              });
            } else {
              Alert.alert("Location Service Not Enabled", "Please enable Location Services for us to accurately track your runs");
            }
          });
        }
      });
    })();
  }, []);

  //Request Pedometer Permission
  const requestActivityRecognitionPermission = async () => {
    const permissionsResult = await PermissionsAndroid.request(
      "android.permission.ACTIVITY_RECOGNITION"
    );
    return permissionsResult;
  };

  //Use effect for Event Registration Changes
  useEffect(() => {
    (async () => {
      setOngoingEventDetails(null);
      checkAndUpdateOngoingEvent();
    })();
  }, [eventRegistrationDetails]);

  //Method to check if there is an Ongoing Event
  const checkAndUpdateOngoingEvent = () => {
    let currentTime = new Date().getTime();
    if (eventRegistrationDetails !== null && eventRegistrationDetails.length > 0) {
      eventRegistrationDetails.map((event) => {
        var eventStartDateTime = new Date(event.eventStartDate);
        var eventEndDateTime = new Date(event.eventEndDate);
        if (currentTime >= eventStartDateTime.getTime() &&
          currentTime < eventEndDateTime.getTime()) {
          setOngoingEventDetails(event);
          NetInfo.fetch().then(state=>setIsOfflineMode(!state.isConnected));
        }
      });
    }
  };

  //Click Event Item Listener
  const onClickEventItem = (eventItem) => {
    setModalEventDetails(eventItem);
    setModalVisible(true);
  };

  //Close Event Item Listener
  const onCloseEventItem = (eventItem) => {
    setModalVisible(false);
  };

  //Register Event Listener
  const onRegisterEventItem = (eventItem) => {
    dispatch(eventActions.registerUserForEvent(modalEventDetails)).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      } else
      if (response.status != StatusCodes.OK) {
        Alert.alert("Registration Failed", "Registration for the event failed, please try again later!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      } else {
        Alert.alert("Registration Successful", "You have been registered successfully, see you on Run Day!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      }
    });
  };

  //Method to lazy load Events from server 
  const loadMoreDataFromServer = () => {
    setIsLoading(true);
    let pageNumber = Math.floor(eventDetails.length / 10);
    dispatch(eventActions.loadEventsFromServer(pageNumber)).then((response) => {
      if (response.status >= StatusCodes.BAD_REQUEST) {
        setIsMoreContentAvailableOnServer(false);
      } else if (response.data && (!response.data.moreContentAvailable)) {
        setIsMoreContentAvailableOnServer(false);
      } else {
        setIsMoreContentAvailableOnServer(true);
      }
      setIsLoading(false);
    });
  };

  //Run Action
  const runAction = async () => {
    var permissionsResult = false;
    DistanceCalculatorModule.isStepCountingAvailable((response) => {
      var isMotionSensorAvailable = response;
      if (isMotionSensorAvailable) {
        if (Platform.Version > 28) {
          permissionsResult = PermissionsAndroid.check(
            "android.permission.ACTIVITY_RECOGNITION"
          );
        } else {
          permissionsResult = PermissionsAndroid.check(
            "com.google.android.gms.permission.ACTIVITY_RECOGNITION"
          );
        }
        if (permissionsResult) {
          navigateToRunTrackerScreen();
        } else {
          Alert.alert("Permission Required", "Physical Activity Permission is mandatory to track distance, make sure to grant this permission", [{
            text: 'OK',
            onPress: () => {
              requestActivityRecognitionPermission().then((response) => {
                if (response === 'granted') {
                  navigateToRunTrackerScreen();
                }
              });
            }
          }], {
            cancelable: false
          });
        }
      } else {
        Alert.alert("No Sensor Detected", "We could not detect any motion sensor in this device");
      }
    });
  };
  //Method to navigate to Run Tracker Screen
  const navigateToRunTrackerScreen = () => {
    props.navigation.navigate('LiveRunTracker', {
      eventId: ongoingEventDetails !== null ? ongoingEventDetails.eventId : 0
    });
  };

  //Trigger Action to Upload Google Fit Runs
  const onClickUpload = () => {
    dispatch(runActions.isConnectedToNetwork()).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      } else {
        GoogleFitJavaModule.hasPermissionsForGoogleFitAPI((response) => {
          setIsGoogleFitConnected(response);
          if (!response) {
            setGoogleFitModalVisible(true);
          } else {
            fetchGoogleFitRuns();
          }
        });
      }
    });
  };

  //Trigger Action to Close Google Fit Modal
  const onCloseGoogleFitModal = () => {
    setGoogleFitModalVisible(false);
  };

  //Trigger Action to Close the modal once Google Run is submitted from within the modal
  const onSubmitGoogleFitRun = (runId) => {
    var runIndex = runHistory.findIndex(run => run.runId.toString() === runId.toString());
    if (runIndex > -1) {
      runHistory.splice(runIndex, 1);
    }
    if (ongoingEventDetails != null) {
      onCloseGoogleFitModal();
    }
  };

  //Method to fetch last 24hrs Google Fit Runs
  const fetchGoogleFitRuns = () => {
    GoogleFitJavaModule.fetchAllActivityForToday((response) => {
      const fetchData = async () => {
        //var response={"1628046344418":{"distance":"203.4629","endTime":"1628086773318","startTime":"1628048285333"},"1628045339849":{"distance":"1076.96","endTime":"1628046344418","startTime":"1628045339849"},"1628044822014":{},"1628042219988":{"distance":"3543.12","endTime":"1628044822014","startTime":"1628042219988"},"1628014594000":{"distance":"36.47","endTime":"1628041446794","startTime":"1628041405972"}};
        var responseMap = new Map(Object.entries(response));
        var responseKeys = Object.keys(response);
        runHistory.length = 0;

        for (var j = 0; j < responseKeys.length; j++) {
          var responseKey = responseKeys[j];
          var bucketMap = new Map(Object.entries(responseMap.get(responseKey)));
          var keys = Array.from(bucketMap.keys());
          var distance = 0.0;
          var startTime = 0;
          var endTime = 0;
          for (var i = 0; i < keys.length; i++) {
            var currentKey = keys[i];
            if (currentKey === "distance") {
              distance = parseFloat(bucketMap.get(currentKey));
            } else if (currentKey === "startTime") {
              startTime = parseFloat(bucketMap.get(currentKey));
            } else if (currentKey === "endTime") {
              endTime = parseFloat(bucketMap.get(currentKey));
            }
          }
          var runIndex = runsHistoryList.findIndex(run => run.runId.toString() === startTime.toString());
          if (distance > 100 && runIndex < 0) {
            var runDateFromTime = new Date(startTime);
            var runDate = runDateFromTime.getDate() + "/" + parseInt(runDateFromTime.getMonth() + 1) + "/" + runDateFromTime.getFullYear();
            var runDay = weekday[runDateFromTime.getDay()];

            var runTotalTime = endTime - startTime;
            const lapsedTimeinMinutes = runTotalTime / 60000;
            const averagePace = lapsedTimeinMinutes / (distance / 1000);

            const lapsedTimeinHours = lapsedTimeinMinutes / 60;
            const averagePaceKmPerHour = (distance / 1000) / lapsedTimeinHours;
            const caloriesBurnt = parseInt((averagePaceKmPerHour * 3.5 * parseInt(userDetails.userWeight)) / 200) * lapsedTimeinMinutes;
            var eventId = ongoingEventDetails !== null ? ongoingEventDetails.eventId : 0;

            if ((lapsedTimeinMinutes<=5 && distance>=1000) || (lapsedTimeinMinutes>5 && averagePace<=20)) {
              var runDetails = new RunDetails(startTime, runTotalTime, distance, averagePace, caloriesBurnt, 0, runDateFromTime.toJSON(), runDate, runDay, [], "", eventId, "0");
              if (runDetails.eventId > 0) {
                var validationResponse = await dispatch(runActions.validateIfRunEligibleForEventSubmission(runDetails));
                if (validationResponse.status !== StatusCodes.DISTANCE_NOT_ELIGIBLE && validationResponse.status !== StatusCodes.TIME_NOT_ELIGIBLE) {
                  setRunHistory((runsHistory) => [...runsHistory, runDetails]);
                }
              } else {
                runHistory.push(runDetails);
              }
            }
          }
        }
        if (runHistory.length > 0) {
          runHistory.sort(function(a, b) {
            return new Date(b.runStartDateTime) - new Date(a.runStartDateTime);
          });
        }
        setGoogleFitModalVisible(true);
      }
      fetchData();
    });
  };
  
//Logic to handle shutter tab for challenges

/*
var isHidden = true;
const [bounceValue, setBounceValue] = useState(new Animated.Value(360));

const toggleSubView=()=>{
 var toValue = 360;
 if(isHidden) {
  toValue = 0;
}
Animated.spring(
  bounceValue,
  {
    toValue: toValue,
    velocity: 3,
    tension: 2,
    friction: 8,
    useNativeDriver: true
  }
  ).start();
isHidden = !isHidden;
};*/

//View
return (
  <View style={styles.runTrackerHomeContainerStyle}>
   
  <Modal animationType="slide" transparent={true} visible={modalVisible}
  onRequestClose={()=>{}}>
   <EventView 
   onRegisterEventItem={onRegisterEventItem} 
   onCloseEventItem={onCloseEventItem} 
   eventDetails={modalEventDetails}/>
  </Modal>

  {ongoingEventDetails===null?(
  <MapView style={styles.mapContainerStyle} region={mapRegion}
  pitchEnabled={false} rotateEnabled={false} zoomEnabled={true} scrollEnabled={false}>
  <Marker coordinate={mapRegion}/>
  </MapView>)
  :(
    <View style={styles.mapContainerStyle}>
    {!isOfflineMode?(
    <ImageBackground
      source={{uri:configData.SERVER_URL+"event-details/getDisplayImage/"+ongoingEventDetails.eventId+"?imageType=DISPLAY"}}
      style={styles.bgImageStyle}>
    </ImageBackground>):(
    <ImageBackground
      source={require('../assets/images/login.jpg')}
      style={styles.bgImageStyle}>
    </ImageBackground>
   )}
   </View>
  )}

  <View style={styles.runButtonStyle}>
   <RoundButton
   title="Go"
   onPress={runAction}/>
  </View>

  <View style={styles.uploadViewStyle}>
    <TouchableOpacity style={styles.uploadButtonStyle} onPress={onClickUpload}>
     <Ionicons name={Platform.OS === 'android'?"md-cloud-upload":"ios-cloud-upload"} size={verticalScale(21)} color='springgreen'/>
     <Text style={styles.buttonTitleStyle}>Upload</Text>
    </TouchableOpacity>
  </View>

  <Modal animationType="slide" transparent={false} visible={googleFitModalVisible}
  onRequestClose={()=>{}}>
 {!isGoogleFitConnected?(
  <SettingsScreen
   onClose={onCloseGoogleFitModal}/>):(
  runHistory.length>0?(
  <React.Fragment>
   <View style={styles.runHistoryContainerStyle}>
    <GoogleFitRunsList
     listData={runHistory}
     onEndReached={()=>{}}
     onSelectRunItem={()=>{}}
     onSubmitRun={onSubmitGoogleFitRun}
     />
   </View>
   <RoundButton 
            title="Close" 
            style={styles.closeButtonStyle} 
            onPress={onCloseGoogleFitModal}/>
    </React.Fragment>
   ):(
   <React.Fragment>
     <View style={styles.runHistoryContainerStyle}>
      <Text style={styles.defaultTextStyle}>No Eligible Runs</Text>
     </View>
   <RoundButton 
            title="Close" 
            style={styles.closeButtonStyle} 
            onPress={onCloseGoogleFitModal}/>
    </React.Fragment>
   )
   )}
  </Modal>

  {ongoingEventDetails===null?(
  <View style={styles.challengeListStyle}>
  <ChallengeList 
  listData={eventDetails}
  onEndReached={loadMoreDataFromServer}
  isLoading={isLoading}
  onClickEventItem={onClickEventItem}/>
  </View>):(<View></View>)}

  {/* Commented for now as Challenge is out of scope for now
  <Animated.View style={[styles.subView,{transform: [{translateY:bounceValue}]}]}>
  <Button title="Challenge" onPress={()=>{toggleSubView()}}/>
  <View style={styles.tabListView}>
  <ChallengeList listData={CHALLENGES}/>
  </View>
  </Animated.View>*/}

  </View>
  );
};

const styles = StyleSheet.create({

  runTrackerHomeContainerStyle: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },

  mapContainerStyle: {
    flex: 1,
    borderRadius: 20
  },

  bgImageStyle: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  runButtonStyle: {
    position: 'absolute',
    top: '65%',
    alignSelf: 'center',
    opacity: 0.9
  },

  uploadViewStyle: {
    position: 'absolute',
    top: '85%',
    alignSelf: 'center',
    opacity: 0.9
  },
  uploadButtonStyle: {
    backgroundColor: 'black',
    width: verticalScale(120),
    height: verticalScale(60),
    borderRadius: verticalScale(25),
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },

  challengeListStyle: {
    position: 'absolute',
    top: '2%'
  },

  buttonTitleStyle: {
    color: 'white',
    fontSize: moderateScale(15, 0.8),
    fontFamily: 'open-sans'
  },

  runHistoryContainerStyle: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: '2%',
  },

  closeButtonStyle: {
      width: '90%',
      height: verticalScale(60),
      alignSelf: 'center',
      borderRadius: 25,
      backgroundColor: 'black',
      opacity: 0.7,
      bottom: '2%',
    },
  defaultTextStyle: {
    fontSize: moderateScale(15, 0.5),
    alignSelf: 'center',
    top: '50%',
    color: 'grey',
    fontFamily: 'open-sans'
  }

  /*tabListView: {
    position: 'absolute',
    top: '20%'
  },

  subView: {
    position: "absolute",
    backgroundColor: "white",
    height: 400,
    width: '100%',
    alignSelf: 'center',
    bottom: 0
  }*/
});

export default RunTrackerHomeScreen;