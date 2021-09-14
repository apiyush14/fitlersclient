import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ImageBackground, Alert} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import { Ionicons } from '@expo/vector-icons';
import RangeSlider from 'rn-range-slider';
import {NativeModules,NativeEventEmitter} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import RunDetails from '../models/rundetails';
import * as runActions from '../store/run-actions';
import StatusCodes from "../utils/StatusCodes.json";

/*
Google Fit Run History Card Item with shadow effects
*/
const GoogleFitRunItem=props=>{

var GoogleFitJavaModule=NativeModules.GoogleFitJavaModule;
const dispatch = useDispatch();

//State Variables
const [trackTimer, setTrackTimer]=useState({
	seconds: "00",
	minutes: "00",
	hours: "00"
});
const [mapRegion, setMapRegion] = useState(null);
const [runPath, setRunPath] = useState([]);
const [runTotalTime, setRunTotalTime] = useState(0);
const [runDistance, setRunDistance] = useState(0);
const [runPace, setRunPace] = useState(0);
const [runCaloriesBurnt, setRunCaloriesBurnt] = useState(0);
const [runStartTimestamp, setRunStartTimestamp] = useState("");
const [runEndTimestamp, setRunEndTimestamp] = useState("");

// State Selectors
const userDetails = useSelector(state => state.userDetails);

  //Load Time Use effect hook
  useEffect(() => {
    setRunPath(props.runPath);
    setRunTotalTime(props.runTotalTime);
    setRunDistance(props.runDistance);
    setRunPace(props.runPace);

    setRunStartTimestamp(formatLongDateTimeToString(props.runStartTime));
    setRunEndTimestamp(formatLongDateTimeToString(props.runEndTime));

    let secondsVar = ("0" + (Math.floor(props.runTotalTime / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(props.runTotalTime / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(props.runTotalTime / 3600000)).slice(-2);
    setTrackTimer({
      seconds: secondsVar,
      minutes: minutesVar,
      hours: hoursVar
    });

    if (props.runPath.length > 0) {
      setMapRegion({
        latitude: props.runPath[Math.floor(props.runPath.length / 2)].latitude,
        longitude: props.runPath[Math.floor(props.runPath.length / 2)].longitude,
        latitudeDelta: Math.abs(props.runPath[props.runPath.length - 1].latitude - props.runPath[0].latitude) + 0.005,
        longitudeDelta: Math.abs(props.runPath[props.runPath.length - 1].longitude - props.runPath[0].longitude) + 0.005
      });
    }
  }, []);

  //Event Trigger for range selection changes
  const onRangeChange = (min, max) => {

    var startTime = min.toString();
    var endTime = max.toString();

    GoogleFitJavaModule.fetchAllActivityForGivenTime(startTime, endTime, (response) => {
      var responseMap = new Map(Object.entries(response));
      var responseKeys = Object.keys(response);

      var responseKey = responseKeys[0];
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
      if (distance > 10) {
        var newRunTotalTime = endTime - startTime;
        setRunDistance(distance);
        setRunTotalTime(newRunTotalTime);

        const lapsedTimeinMinutes = newRunTotalTime / 60000;
        const averagePace = lapsedTimeinMinutes / (distance / 1000);
        setRunPace(averagePace);

        const lapsedTimeinHours = lapsedTimeinMinutes / 60;
        const averagePaceKmPerHour = (distance / 1000) / lapsedTimeinHours;
        const caloriesBurnt = parseInt((averagePaceKmPerHour * 3.5 * parseInt(userDetails.userWeight)) / 200) * lapsedTimeinMinutes;
        setRunCaloriesBurnt(caloriesBurnt);

        let secondsVar = ("0" + (Math.floor(newRunTotalTime / 1000) % 60)).slice(-2);
        let minutesVar = ("0" + (Math.floor(newRunTotalTime / 60000) % 60)).slice(-2);
        let hoursVar = ("0" + Math.floor(newRunTotalTime / 3600000)).slice(-2);
        setTrackTimer({
          seconds: secondsVar,
          minutes: minutesVar,
          hours: hoursVar
        });
      }
    });
    setRunStartTimestamp(formatLongDateTimeToString(min));
    setRunEndTimestamp(formatLongDateTimeToString(max));
  };
  
  //Method to format Date Time to readable format
  const formatLongDateTimeToString = (longDateTime) => {
    var date = new Date(longDateTime);
    var formattedTime = ("0" + Math.floor(date.getHours())).slice(-2) + ":" + ("0" + Math.floor(date.getMinutes())).slice(-2) + ":" + ("0" + Math.floor(date.getSeconds())).slice(-2);
    return formattedTime;
  };

  //Trigger Event to Select Run
  const onSelectRunItem = () => {
    Alert.alert(
      "Submit Run",
      "Are you sure you want to submit this run?", [{
        text: "Yes",
        onPress: submitRun
      }, {
        text: "No",
      }], {
        cancelable: true
      }
    );
  };

  //Trigger Event to Submit Run
  const submitRun = () => {
    let runDetails = new RunDetails(props.runStartTime, runTotalTime, runDistance, runPace, runCaloriesBurnt, 0, props.runStartDateTime, props.runDate, props.runDay, props.runPath, props.runTrackSnapUrl, props.eventId, props.isSyncDone);
    if (runDetails.eventId > 0) {
      dispatch(runActions.validateIfRunEligibleForEventSubmission(runDetails)).then((response) => {
        if (response.status === StatusCodes.DISTANCE_NOT_ELIGIBLE) {
          Alert.alert("Run Not Eligible", "The selected Run is not eligible for submission, please resubmit!!!");
        } else if (response.status === StatusCodes.TIME_NOT_ELIGIBLE) {
          Alert.alert("Run Not Eligible", "The selected Run is not eligible for submission, please resubmit!!!");
        } else if (response.status >= StatusCodes.BAD_REQUEST) {

        } else {
          submitRunDetails(runDetails);
        }
      });
    } else {
      submitRunDetails(runDetails);
    }
  };

  //Method to submit run details to DB and Server
  const submitRunDetails = (runDetails) => {
    var isResponseReceived = false;
    dispatch(runActions.addRun(runDetails)).then((response) => {
      isResponseReceived = true;
      if (runDetails.eventId > 0) {
        if (response.status === StatusCodes.NO_INTERNET) {
          Alert.alert("Internet Issue", "The selected run is not yet submitted due to connectivity issue, please check the internet connection and reload the application to submit this run!!!");
        } else if (response.status >= StatusCodes.BAD_REQUEST) {
          Alert.alert("Technical Issue", "The selected run is not yet submitted due to technical issue, please reload the application to submit this run!!!");
        } else {
          Alert.alert("Success", "The selected run has been submitted successfully for the event!!!");
          props.onSubmitRun();
        }
      } else if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        Alert.alert("Run Not Saved", "Sorry, we could not save this Run!!!");
      } else {
        Alert.alert("Success", "Your Run has been submitted successfully!!!");
        props.onSubmitRun();
      }
    });
  };

const renderThumb=()=>{
  return (
     <View style={{
      width: 20,
      height: 20,
      borderRadius: 20,
      backgroundColor: '#0D8675',
     }}>
     </View>
    );
};

const renderRail=()=>{
  return (
     <View style={{
      flex: 1,
      height: 2,
      borderRadius: 1,
      backgroundColor: 'lightgrey',
     }}>
     </View>
    );
};

const renderRailSelected=()=>{
  return (
     <View style={{
      height: 1,
      backgroundColor: 'black',
      borderRadius: 1,
     }}>
     </View>
    );
};

const renderLabel=(value)=>{
  return (
     <View style={{
      alignItems: 'center',
      padding: 8,
      backgroundColor: '#4499ff',
      borderRadius: 20,
     }}>
     <Text style={{
      fontSize: 12,
      color: 'black',
     }}
     >{formatLongDateTimeToString(value)}</Text>
     </View>
    );
};

const renderNotch=()=>{
  return (
     <View style={{
      width: 8,
      height: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#4499ff',
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderTopWidth: 8,
     }}>
     </View>
    );
};

return(
 	<View style={styles.googleFitRunItemContainerStyle}>
 	<TouchableOpacity onPress={onSelectRunItem}>
  
 	 <View style={styles.mapContainerViewStyle}>
   {runPath&&runPath.length>0?(
   <MapView style={styles.mapContainerStyle} region={mapRegion}
    pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}>
     <Polyline
     strokeWidth={2}
     strokeColor='red'
     coordinates={runPath}/>
     {runPath[0]!==undefined?(
     <Marker opacity={0.8} pinColor='green' coordinate={runPath[0]}/>):(<View></View>)}
      {runPath[runPath.length-1]!==undefined?(
     <Marker opacity={0.8} pinColor='wheat' coordinate={runPath[runPath.length-1]}/>):(<View></View>)}
   </MapView>):
    <View style={styles.mapContainerStyle}>
     <ImageBackground 
      source={require('../assets/images/no_location.jpg')} 
      style={styles.bgImage}>
     </ImageBackground>
    </View>}
   </View>

   <View style={styles.runDetailsContainerStyle}>
    <View style={styles.runDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-walk":"ios-walk"} size={verticalScale(20)} color='grey'/>
     <Text style={styles.runDetailsTextStyle}>{parseFloat(runDistance/1000).toFixed(2)} KM</Text>
    </View>

    <View style={styles.runDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"} size={verticalScale(20)} color='grey'/>
     <Text style={styles.runDetailsTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
    </View>

    <View style={styles.runDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"} size={verticalScale(20)} color='grey'/>
     <Text style={styles.runDetailsTextStyle}>{parseFloat(runPace).toFixed(2)}</Text>
    </View>
   </View>

  <View style={styles.calendarContainerViewStyle}>
   <Text style={styles.calendarTextStyle}>{props.runDay}</Text>
   <View style={styles.calendarLineStyle}>
   </View>
   <Text style={styles.calendarTextStyle}>{props.runDate}</Text>
  </View>
     
     <View style={styles.rangeSelectorContainerStyle}>
      <View style={styles.rangeSelectorViewStyle}>
       <RangeSlider
        style={{width: 300, height: 80}}
        min={props.runStartTime}
        max={props.runEndTime}
        minRange={300000}
        step={300000}
        floatingLabel={true}
        allowLabelOverflow={false}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onTouchEnd={onRangeChange}/>
      </View>

      <View style={styles.rangeSelectionTimeViewStyle}>
       <View style={styles.selectedRangeStartStyle}>
        <Text style={styles.syncStatusTextStyle}>Start : {runStartTimestamp}</Text>
       </View>
       <View style={styles.selectedRangeEndStyle}>
         <Text style={styles.syncStatusTextStyle}>End : {runEndTimestamp}</Text>
       </View>
      </View>
 	   </View>

 	</TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
  googleFitRunItemContainerStyle: {
    height: verticalScale(160),
    width: scale(330),
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: verticalScale(8),
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center'
  },
  mapContainerViewStyle: {
    height: '70%',
    width: '30%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapContainerStyle: {
    flex: 1
  },
  bgImage: {
   flex: 1
  },

  runDetailsContainerStyle: {
    position: "absolute",
    flexDirection: 'column',
    alignSelf: 'center',
    width: '40%',
    height: '100%',
    alignItems: 'center'
  },
  runDetailsRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%'
  },

  calendarContainerViewStyle: {
    width: '30%',
    height: '70%',
    borderRadius: 20,
    position: "absolute",
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  calendarLineStyle: {
    width: '100%',
    borderWidth: 0.4,
    borderColor: 'lightgrey'
  },
  syncStatusDoneViewStyle:{
    position: "absolute",
    bottom: 0,
    backgroundColor: 'lightgreen',
    borderRadius: 20,
    width: '95%',
    opacity: 0.5
  },
  syncStatusPendingViewStyle:{
    position: "absolute",
    bottom: 0,
    backgroundColor: 'orange',
    borderRadius: 20,
    width: '95%',
    opacity: 0.5
  },
  rangeSelectorContainerStyle: {
    position: 'absolute',
    height: '30%',
    width: '100%',
    bottom: 0,
  },
  rangeSelectorViewStyle:{
    alignSelf: 'center',
    marginTop: '5%'
  },
  rangeSelectionTimeViewStyle: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    top: 50
  },
  selectedRangeStartStyle: {
    flex: 1,
  },
  selectedRangeEndStyle: {
    flex: 1,
  },

  runDetailsTextStyle: {
    fontSize: moderateScale(14, 0.8),
    color: 'black',
    paddingHorizontal: '7%',
    fontFamily: 'open-sans'
  },
  calendarTextStyle: {
    fontSize: moderateScale(12, 0.8),
    color: 'black',
    paddingVertical: '2%',
    alignSelf: 'center',
    fontFamily: 'open-sans'
  },
  syncStatusTextStyle: {
    fontSize: moderateScale(8, 0.8),
    color: 'black',
    paddingVertical: '2%',
    alignSelf: 'center',
    fontFamily: 'open-sans',
  }
});

export default GoogleFitRunItem;