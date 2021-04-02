import React, { useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import * as Location from 'expo-location';
import { DeviceMotion, Pedometer } from 'expo-sensors';
import Slider from '../components/Slider';
import { Ionicons } from '@expo/vector-icons';
import RunDetails from '../models/rundetails';

let startTime=Date.now();
let eventId=0;
let timerForAutoPause=0;
let runDistanceForAutoPause=0;
let runDetails=null;

//Variables for Listeners
let updateStepsListener=null;
let updateLocationListener=null;

let rangeOfAcceleration=[0.3,2,10,15,40,60,80];
let rangeOfMultiplyingFactor=[0.30,0.40, 0.52, 0.60, 0.68, 0.83, 1.07];
let strideMultiplyingFactor=0.30;//Default Multiplier based on 12.5 average pace
let averageAcceleration=0.3;//Default Acceleration Value based on 12.5 average pace
let accelerationValues=[];

let prevStepsCount=0;
let stepsCount=0;
let changeInStepsCount=0;

//Live Run Tracker Screen, uses 3 sensors for operation (pedometer, accelerometer, gps)
const LiveRunTrackerScreen = props=>{

  // State Selectors
  const userDetails = useSelector(state => state.userDetails);

  //State Variables
  const [isPaused, setIsPaused] = useState(false);
  const [runDistance, setRunDistance] = useState(0);
  const [runPace, setRunPace] = useState(12.5);
  //To be removed
  const [stepsCountUI, setStepsCountUI] = useState(0);

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
    var today = new Date();
    var runDate = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
    var runDay = weekday[today.getDay()];
    startTime = Date.now();
    eventId = props.route.params.eventId;
    subscribePedometer();
    subscribeAccelerometer();
    subscribeLocationUpdates();
    runDetails = new RunDetails(today.getTime(), 0, 0, runPace, 0, 0,  today.toJSON(), runDate, runDay, [], "", eventId, "0");
  }, []);

  //Subscribe Pedometer to count steps
  const subscribePedometer = () => {
    updateStepsListener = Pedometer.watchStepCount((updatedSteps) => {
      updateStepsCount(updatedSteps);
    });
  };

  //UnSubscribe Pedometer Updates
  const unSubscribePedometer = () => {
    prevStepsCount=0;
    if (updateStepsListener) {
      updateStepsListener.remove();
    }
  };

  //Pedometer's Updates Listener
  const updateStepsCount = (updatedSteps) => {
    //Sync call to Update Distance
    updateDistanceBasedOnChangeInStepsCount(updatedSteps.steps - prevStepsCount);
    //To be removed
    setStepsCountUI((stepsCountUI) => {
      return stepsCountUI + (updatedSteps.steps - prevStepsCount);
    });
    prevStepsCount = updatedSteps.steps;
  };

  //Sync Update distance once steps count changes
  const updateDistanceBasedOnChangeInStepsCount = (changeInStepsCount) => {
    if (changeInStepsCount > 0) {
      //Empty the array to calculate average acceleration
      accelerationValues = [];
      runDistanceForAutoPause = runDistanceForAutoPause + 1;

      var minStrideMultiplier = 0.30;
      var maxStrideMultiplier = 0.40;
      var minPace = 10;
      var maxPace = 2;

      for (var i = 0; i < rangeOfAcceleration.length - 1; i++) {
        if (averageAcceleration >= rangeOfAcceleration[i] &&
          averageAcceleration <= rangeOfAcceleration[i + 1]) {
          minStrideMultiplier = rangeOfMultiplyingFactor[i];
          maxStrideMultiplier = rangeOfMultiplyingFactor[i + 1];
          minPace = rangeOfAcceleration[i + 1];
          maxPace = rangeOfAcceleration[i];
          break;
        }
      }

      strideMultiplyingFactor = maxStrideMultiplier - (((averageAcceleration - (minPace)) / (maxPace - minPace)) *
        (maxStrideMultiplier - minStrideMultiplier));
      var strideValue = parseInt(userDetails.userHeight) * strideMultiplyingFactor;

      var changeInDistanceInMeters = (changeInStepsCount * strideValue) / 100;

      setRunDistance((prevDistance) => {
        var newDistance = prevDistance + changeInDistanceInMeters;
        runDetails.runDistance = newDistance;
        updatePaceAndCalories(newDistance);
        return newDistance;
      });
    }
  };


  //Sync method to Update Pace And Calories based on total distance
  const updatePaceAndCalories = (runDistance) => {
    if (runDistance > 0) {
      //Update average pace
      const lapsedTimeinMinutes = runDetails.runTotalTime / 60000;
      const averagePace = lapsedTimeinMinutes / (runDistance / 1000);
      if (averagePace < 12.5) {
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
    Location.requestPermissionsAsync().then(response => {
      if (response.status !== 'granted') {
        //TODO : To handle alert to change settings
        //Alert.alert("Location Alert", "Location Permission is required!!!");
        //Linking.openURL('app-settings:');
      } else {
        updateLocationListener = Location.watchPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 10
        }, (updatedLocation) => {
          updateLocation(updatedLocation);
        });
      }
    });
  };

  //Location Update Listener
  const updateLocation = (updatedLocation) => {
    if (!isPaused) {
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

  //Method to Subscribe to Accelerometer and add a listener to update every second
  const subscribeAccelerometer = () => {
    DeviceMotion.addListener(accelerometerData => {
      updateAccelerometerData(accelerometerData);
    });
  };

  //Method to Unsubscribe Accelerometer
  const unSubscribeAccelerometer = () => {
    DeviceMotion.removeAllListeners();
  };

  //Method to Update UI each second based on accelerometer data
  const updateAccelerometerData = (accelerometerData) => {
    (async () => {
      DeviceMotion.setUpdateInterval(1000);
      //Automatically pause the run if there is no distance tracked since last configured secs
      if (timerForAutoPause >= 30 && runDistanceForAutoPause < 1) {
        timerForAutoPause = 0;
        runDistanceForAutoPause = 0;
        pauseRun();
      }
      if (timerForAutoPause >= 20) {
        timerForAutoPause = 0;
        runDistanceForAutoPause = 0;
      } else {
        timerForAutoPause = timerForAutoPause + 1;
      }

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

      let magnitude = Math.sqrt(accelerometerData.acceleration.x * accelerometerData.acceleration.x +
        accelerometerData.acceleration.y * accelerometerData.acceleration.y +
        accelerometerData.acceleration.z * accelerometerData.acceleration.z);

      /*let magnitudeIncludeAcclr = Math.sqrt(accelerometerData.accelerationIncludingGravity.x * accelerometerData.accelerationIncludingGravity.x +
          accelerometerData.accelerationIncludingGravity.y * accelerometerData.accelerationIncludingGravity.y +
          accelerometerData.accelerationIncludingGravity.z * accelerometerData.accelerationIncludingGravity.z);*/

      accelerationValues.push(magnitude);
      const sum = accelerationValues.reduce((a, b) => a + b, 0);
      averageAcceleration = (sum / accelerationValues.length) || 0.3;
    })();
  };

  //Complete the run if distance more than 10m and load Run Details Screen
  const stopRun = () => {
    if (runDistance > 10) {
      props.navigation.navigate('RunDetailsScreen', {
        runDetails: runDetails
      });
    } else {
      props.navigation.navigate('HomeScreen');
    }
  };

  // Pause Run
  const pauseRun = () => {
    setIsPaused(true);
    unSubscribeAccelerometer();
    unSubscribePedometer();
    accelerationValues = [];
  };

  //Resume Run
  const resumeRun = () => {
    startTime = Date.now();
    setIsPaused(false);
    subscribeAccelerometer();
    subscribePedometer();
  };
//View
return (
 <View style={styles.liveRunTrackerContainerStyle}>
 {!isPaused?
   (
    <TouchableOpacity style={styles.pauseResumeRunButtonStyle} onPress={()=>{pauseRun()}}>
     <Ionicons name={Platform.OS === 'android'?"md-pause":"ios-pause"}
     size={48} color='white'/>
    </TouchableOpacity>
    ):
    (
    <TouchableOpacity style={styles.pauseResumeRunButtonStyle} onPress={()=>{resumeRun()}}>
     <Ionicons name={Platform.OS === 'android'?"md-play":"ios-play"}
     size={48} color='white'/>
    </TouchableOpacity>
    )
  }
  {isPaused?
   (<View style={styles.sliderContainerStyle}>
   <Slider
   sliderAction={stopRun}
   buttonTitle='Stop' 
   bounceValue={220} 
   />
   </View>):(<View></View>)
 }

 <View style={styles.runPaceContainerStyle}>
  <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"}
  size={24} color='lightgrey'/>
  <Text style={styles.smallTextStyle}>{parseFloat(runPace).toFixed(2)}</Text>
 </View>

 <View style={styles.runTotalTimeContainerStyle}>
  <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"}
  size={24} color='lightgrey'/>
 <Text style={styles.smallTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
 </View>

 <View style={styles.distanceContainerStyle}>
  <Text style={styles.largeTextStyle}>{parseFloat(runDistance/1000).toFixed(2)}</Text>
  <Text style={styles.mediumTextStyle}>KM</Text>
 </View>

    <View style={styles.testPosition}>
     <Text>{stepsCountUI}</Text>
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
  },

  textTest: {
    fontSize: moderateScale(20, 0.8),
    color: 'black',
    alignSelf: 'center'
  },
  testPosition: {
    position: 'absolute',
    top: '50%',
    width: verticalScale(200),
    height: verticalScale(60),
    backgroundColor: 'white',
    alignSelf: 'center'
  }

});

export default LiveRunTrackerScreen;