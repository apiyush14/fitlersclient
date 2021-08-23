import React, { useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import * as Location from 'expo-location';
import Slider from '../components/Slider';
import { Ionicons } from '@expo/vector-icons';
import RunDetails from '../models/rundetails';

import {NativeModules,NativeEventEmitter} from 'react-native';

//let accelerationValuesToBeStored=[];

let startTime=Date.now();
let eventId=0;
let timerForAutoPause=Date.now();
let runDistanceForAutoPause=0;
let runDetails=null;

//Variables for Listeners
let updateDistanceListener=null;
let updateLocationListener=null;

//Live Run Tracker Screen, uses 3 sensors for operation (pedometer, accelerometer, gps)
const LiveRunTrackerScreen = props=>{
  var DistanceCalculatorModule=NativeModules.DistanceCalculatorModule;
  var distanceUpdateEventEmitter = new NativeEventEmitter(NativeModules.DistanceCalculatorModule);

  // State Selectors
  const userDetails = useSelector(state => state.userDetails);

  //State Variables
  const [isPaused, setIsPaused] = useState(false);
  const [runDistance, setRunDistance] = useState(0);
  const [runPace, setRunPace] = useState(12.5);

  const [trackTimer, setTrackTimer] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00"
  });

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  //Load Time useEffect hook
  useEffect(() => {
    //accelerationValuesToBeStored=[];

    var today = new Date();
    var runDate = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
    var runDay = weekday[today.getDay()];
    startTime = Date.now();
    eventId = props.route.params.eventId;
    timerForAutoPause=startTime;
    runDistanceForAutoPause=0;
    runDetails=null;

    subscribeDistanceCalculator();
    subscribeLocationUpdates();

    runDetails = new RunDetails(today.getTime(), 0, 0, runPace, 0, 0,  today.toJSON(), runDate, runDay, [], "", eventId, "0");
  }, []);

  //Subscribe Distance Calculator to get distance updates
  const subscribeDistanceCalculator = () => {
    if (updateDistanceListener) {
      updateDistanceListener.remove();
    }
    DistanceCalculatorModule.watchDistanceUpdates(parseInt(userDetails.userHeight));
    updateDistanceListener=distanceUpdateEventEmitter.addListener('distanceDataDidUpdate',(updatedDistance)=>{
       updateTimeOnUI();
       updateDistanceData(updatedDistance);
    });
  };

  //UnSubscribe Pedometer Updates
  const unSubscribeDistanceCalculator = () => {
    if (updateDistanceListener) {
      updateDistanceListener.remove();
      DistanceCalculatorModule.stopDistanceUpdates();
    }
  };

  //Distance Calculator Updates Listener
  const updateDistanceData = (updatedDistance) => {
    //Sync call to Update Distance
    var changeInDistanceInMeters=parseFloat(updatedDistance.changeInDistance);
    if (changeInDistanceInMeters > 0.0) {
      runDetails.runDistance = runDetails.runDistance + changeInDistanceInMeters;
      setRunDistance(runDetails.runDistance);
      updatePaceAndCalories(runDetails.runDistance);
      //accelerationValuesToBeStored.push(updatedDistance.steps+";"+updatedDistance.distance);
    }
  };

  //Sync method to Update Pace And Calories based on total distance
  const updatePaceAndCalories = (runDistance) => {
    if (runDistance > 0) {
      //Update average pace
      const lapsedTimeinMinutes = runDetails.runTotalTime / 60000;
      const averagePace = lapsedTimeinMinutes / (runDistance / 1000);
      if (averagePace < 12.5 && averagePace>0) {
        runDetails.runPace = averagePace;
        setRunPace(averagePace);
      }

      //Update Total Calories Burnt
      const lapsedTimeinHours = lapsedTimeinMinutes / 60;
      const averagePaceKmPerHour = (runDistance / 1000) / lapsedTimeinHours;
      const caloriesBurnt = parseInt((averagePaceKmPerHour * 3.5 * parseInt(userDetails.userWeight)) / 200) * lapsedTimeinMinutes;
      runDetails.runCaloriesBurnt = caloriesBurnt;
    }
  };

  //Subscriber for Location Updates
  const subscribeLocationUpdates = () => {
    Location.getForegroundPermissionsAsync().then(response => {
      if (response.status === 'granted') {
        Location.hasServicesEnabledAsync().then(response => {
          if (response) {
            updateLocationListener = Location.watchPositionAsync({
              accuracy: Location.Accuracy.Highest,
              timeInterval: 1000,
              distanceInterval: 10
            }, (updatedLocation) => {
              updateLocation(updatedLocation);
            });
          }
        });
      }
    });
  };

  //Location Update Listener
  const updateLocation = (updatedLocation) => {
    if (!isPaused && parseFloat(updatedLocation.coords.accuracy)<=50) {
      let location = updatedLocation;
      let currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.000757,
        longitudeDelta: 0.0008,
        weight: 2
      };
      runDetails.runPath = [...runDetails.runPath, currentLocation];
    }
  };

  //Method to Update UI each second
  const updateTimeOnUI = (accelerometerData) => {
    (async () => {
      const currentTime = await Date.now();

      let updatedLapsedTime = await runDetails.runTotalTime + (currentTime - startTime);
      let secondsVar = await ("0" + (Math.floor(updatedLapsedTime / 1000) % 60)).slice(-2);
      let minutesVar = await ("0" + (Math.floor(updatedLapsedTime / 60000) % 60)).slice(-2);
      let hoursVar = await ("0" + Math.floor(updatedLapsedTime / 3600000)).slice(-2);

      setTrackTimer({
        seconds: secondsVar,
        minutes: minutesVar,
        hours: hoursVar
      });

      runDetails.runTotalTime = updatedLapsedTime;
      startTime = currentTime;
    })();
  };
  //Complete the run if distance more than 10m and load Run Details Screen
  const stopRun = () => {
    if (runDistance > 10) {

      runDetails.runDistance=1000;
      runDetails.runTotalTime=320000;

      updatePaceAndCalories(runDetails.runDistance);
      //DistanceCalculatorModule.createFile(runDetails.runId.toString(), JSON.stringify(accelerationValuesToBeStored));
      props.navigation.navigate('Run Details', {
        runDetails: runDetails
      });
    } else {
      props.navigation.navigate('Home');
    }
  };

  // Pause Run
  const pauseRun = () => {
    setIsPaused(true);
    unSubscribeDistanceCalculator();
  };

  //Resume Run
  const resumeRun = () => {
    startTime = Date.now();
    timerForAutoPause = startTime;
    runDistanceForAutoPause = 0;
    setIsPaused(false);
    subscribeDistanceCalculator();
  };

//View
return (
 <View style={styles.liveRunTrackerContainerStyle}>
 {!isPaused?
   (
    <TouchableOpacity style={styles.pauseResumeRunButtonStyle} onPress={()=>{pauseRun()}}>
     <Ionicons name={Platform.OS === 'android'?"md-pause":"ios-pause"}
     size={verticalScale(42)} color='white'/>
    </TouchableOpacity>
    ):
    (
    <TouchableOpacity style={styles.pauseResumeRunButtonStyle} onPress={()=>{resumeRun()}}>
     <Ionicons name={Platform.OS === 'android'?"md-play":"ios-play"}
     size={verticalScale(42)} color='white'/>
    </TouchableOpacity>
    )
  }
  {isPaused?
   (<View style={styles.sliderContainerStyle}>
   <Slider
   sliderAction={stopRun}
   buttonTitle='Stop' 
   bounceValue={scale(220)} 
   />
   </View>):(<View></View>)
 }

 <View style={styles.runPaceContainerStyle}>
  <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"}
  size={verticalScale(20)} color='lightgrey'/>
  <Text style={styles.smallTextStyle}>{parseFloat(runPace).toFixed(2)}</Text>
 </View>

 <View style={styles.runTotalTimeContainerStyle}>
  <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"}
  size={verticalScale(20)} color='lightgrey'/>
 <Text style={styles.smallTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
 </View>

 <View style={styles.distanceContainerStyle}>
  <Text style={styles.largeTextStyle}>{parseFloat(runDistance/1000).toFixed(2)}</Text>
  <Text style={styles.mediumTextStyle}>KM</Text>
 </View>

 </View>
 );
};

const styles = StyleSheet.create({
  liveRunTrackerContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },

  runPaceContainerStyle: {
    position: 'absolute',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: '10%',
    marginLeft: '5%'
  },

  runTotalTimeContainerStyle: {
    position: 'absolute',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: '10%',
    marginRight: '5%'
  },

  distanceContainerStyle: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: verticalScale(200),
    height: verticalScale(200),
    borderRadius: verticalScale(100),
    borderWidth: 3,
    borderColor: 'springgreen',
    backgroundColor: 'black',
    shadowColor: 'springgreen',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 6,
  },

  pauseResumeRunButtonStyle: {
    position: 'absolute',
    top: '63%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(80 / 2),
    borderColor: 'springgreen',
    borderWidth: 2,
    backgroundColor: 'black',
    shadowColor: 'springgreen',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 6
  },

  sliderContainerStyle: {
    top: '80%'
  },

  largeTextStyle: {
    fontSize: moderateScale(45, 0.8),
    color: 'lightgrey',
    fontFamily: 'open-sans'
  },
  mediumTextStyle: {
    fontSize: moderateScale(40, 0.8),
    color: 'lightgrey',
    fontFamily: 'open-sans'
  },
  smallTextStyle: {
    padding: '3%',
    fontSize: moderateScale(30, 0.8),
    color: 'lightgrey',
    fontFamily: 'open-sans'
  }
});

export default LiveRunTrackerScreen;