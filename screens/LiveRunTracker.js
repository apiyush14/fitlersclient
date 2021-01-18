import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';
import Slider from '../components/Slider';
import { Ionicons } from '@expo/vector-icons';

let runId=0;
let runTotalTime=0;
let runPath=[];
let startTime=Date.now();
let lastLocation={};
let temporaryDistance=0;
let runDate=null;
let runDay=null;
let runStartDateTime=null;
let eventId=0;
let timerForAutoPause=0;
let runDistanceForAutoPause=0;

const LiveRunTrackerScreen = props=>{

  //State Variables
  const [isPaused, setIsPaused] = useState(false);
  const [runDistance, setRunDistance] = useState(0);
  const [runPace, setRunPace] = useState(0.00);
  const [runCaloriesBurnt, setRunCaloriesBurnt] = useState(0);
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


  const haversine = require('haversine');

  //Load Time useEffect hook
  useEffect(() => {
    var today = new Date();
    runId = today.getTime();
    runStartDateTime = today.toJSON();
    runDate = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
    runDay = weekday[today.getDay()];
    runTotalTime = 0;
    runPath = [];
    startTime = Date.now();
    eventId = props.route.params.eventId;
    subscribeAccelerometer();
    /*let timer = setInterval(() => updateUI() , 1000);
    return () => clearInterval(timer)*/
  }, []);

  //Method to Subscribe to Accelerometer and add a listener to update every second
  const subscribeAccelerometer = () => {
    DeviceMotion.setUpdateInterval(1000);
    DeviceMotion.addListener(accelerometerData => {
      updateUI(accelerometerData);
    });
  };

  //Method to Unsubscribe Accelerometer
  const unSubscribeAccelerometer = () => {
    DeviceMotion.removeAllListeners();
  };


  // Update averagePace and Calories once distance gets changed
  useEffect(() => {
    if (runDistance > 0) {
      runDistanceForAutoPause = runDistanceForAutoPause + 1;
      //Update average pace
      const lapsedTimeinMinutes = runTotalTime / 60000;
      const averagePace = lapsedTimeinMinutes / (runDistance / 1000);
      setRunPace(averagePace);

      //TODO : Update the formula to get weight from user details
      //Update Total Calories Burnt
      const lapsedTimeinHours = lapsedTimeinMinutes / 60;
      const averagePaceKmPerHour = (runDistance / 1000)/lapsedTimeinHours;
      const caloriesBurnt = parseInt((averagePaceKmPerHour*3.5*68)/200)*lapsedTimeinMinutes;
      setRunCaloriesBurnt(caloriesBurnt);
    }
  }, [runDistance]);


  //Method to Update UI each second based on accelerometer data
  const updateUI = (accelerometerData) => {
    (async () => {

      //Automatically pause the run if there is no distance tracked since last configured secs
      if (timerForAutoPause >= 20 && runDistanceForAutoPause === 0) {
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
      let updatedLapsedTime = await runTotalTime + (currentTime - startTime);
      let secondsVar = await ("0" + (Math.floor(updatedLapsedTime / 1000) % 60)).slice(-2);
      let minutesVar = await ("0" + (Math.floor(updatedLapsedTime / 60000) % 60)).slice(-2);
      let hoursVar = await ("0" + Math.floor(updatedLapsedTime / 3600000)).slice(-2);

      setTrackTimer({
        seconds: secondsVar,
        minutes: minutesVar,
        hours: hoursVar
      });

      runTotalTime = updatedLapsedTime;
      startTime = currentTime;

      // Update Location
      let location = await Location.getCurrentPositionAsync({});

      if (location) {
        let currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.000757,
          longitudeDelta: 0.0008,
          weight: 2
        };

        let isToUpdatePath = false;
        //console.log(accelerometerData);

        let magnitude = Math.sqrt(accelerometerData.acceleration.x * accelerometerData.acceleration.x +
          accelerometerData.acceleration.y * accelerometerData.acceleration.y +
          accelerometerData.acceleration.z * accelerometerData.acceleration.z);

        let magnitudeIncludeAcclr = Math.sqrt(accelerometerData.acceleration.x * accelerometerData.acceleration.x +
          accelerometerData.acceleration.y * accelerometerData.acceleration.y +
          accelerometerData.acceleration.z * accelerometerData.acceleration.z);

        //console.log(accelerometerData);
        if (runPath.length === 0) {
          isToUpdatePath = true;
        }

        //Calibrate here for accelerometer sensor
        // When Running
        else if (runPath.length > 0 && magnitude > 6) {
          /*console.log("----------Adding------------");
          console.log(accelerometerData);*/
          let endLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          };

          /*let startLocation={
        latitude: pathArray[pathArray.length-1].latitude,
        longitude: pathArray[pathArray.length-1].longitude
      };*/

          let lastLocationVar = {
            latitude: lastLocation.latitude,
            longitude: lastLocation.longitude
          }
          temporaryDistance = temporaryDistance + haversine(lastLocationVar, endLocation, {
            unit: 'meter'
          });
          if (temporaryDistance >= 10) {
            isToUpdatePath = true;
            setRunDistance(runDistance => {
              //console.log(totalDistance+haversine(startLocation, endLocation, {unit: 'meter'}));
              return runDistance + temporaryDistance;
            });
            temporaryDistance = 0;
          }

        }
        if (isToUpdatePath) {
          runPath = [...runPath, currentLocation];
        }
        lastLocation = currentLocation;
        //return [...pathArray,currentLocation];});
        //}
      }
    })();
  };

  //Complete the run if distance more than 10m and load Run Details Screen
  const stopRun = () => {
    //Accelerometer.removeAllListeners();
    if (runDistance > 10) {
      props.navigation.navigate('RunDetailsScreen', {
        runId: runId,
        runPath: runPath,
        runDate: runDate,
        runDay: runDay,
        runTotalTime: runTotalTime,
        runDistance: runDistance,
        runPace: runPace,
        runCaloriesBurnt: runCaloriesBurnt,
        runStartDateTime: runStartDateTime,
        eventId: eventId
      });
    } else {
      props.navigation.navigate('HomeScreen');
    }
  };

  // Pause Run
  const pauseRun = () => {
    setIsPaused(true);
    unSubscribeAccelerometer();
  };

  //Resume Run
  const resumeRun = () => {
    //setStartTime(Date.now());
    startTime = Date.now();
    setIsPaused(false);
    subscribeAccelerometer();
  };
/*console.log(haversine(start, end))
console.log(haversine(start, end, {unit: 'mile'}))
console.log(haversine(start, end, {unit: 'meter'}))*/
/*console.log(haversine(start, end, {threshold: 1}))
console.log(haversine(start, end, {threshold: 1, unit: 'mile'}))
console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))*/

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
    color: 'lightgrey'
  },
  mediumTextStyle: {
    fontSize: moderateScale(40, 0.8),
    color: 'lightgrey'
  },
  smallTextStyle: {
    padding: '3%',
    fontSize: moderateScale(30, 0.8),
    color: 'lightgrey'
  }

});

export default LiveRunTrackerScreen;