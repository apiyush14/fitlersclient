import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import * as Location from 'expo-location';
import { DeviceMotion, Pedometer } from 'expo-sensors';
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

let updateStepsListener=null;
let updateLocationListener=null;

let rangeOfAcceleration=[0.3,2,10,15,40,60,80];
let rangeOfMultiplyingFactor=[0.30,0.40, 0.52, 0.54, 0.68, 0.83, 1.07];
let strideMultiplyingFactor=0.30;//Default Multiplier based on 12.5 average pace
let averageAcceleration=0.3;//Default Acceleration Value based on 12.5 average pace
let accelerationValues=[];

//Live Run Tracker Screen, uses 3 sensors for operation (pedometer, accelerometer, gps)
const LiveRunTrackerScreen = props=>{

  const height=170.66;
  //State Variables
  const [isPaused, setIsPaused] = useState(false);
  const [runDistance, setRunDistance] = useState(0);
  const [runPace, setRunPace] = useState(12.5);
  const [runCaloriesBurnt, setRunCaloriesBurnt] = useState(0);
  const [prevStepsCount, setPrevStepsCount] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [changeInStepsCount, setChangeInStepsCount] = useState(0);
  const [trackTimer, setTrackTimer] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00"
  });

  const [runLevel, setRunLevel] = useState(6);
  const [toggleDistance, setToggleDistance] = useState(false);
  const [toggleLocation, setToggleLocation] = useState(false);
  const [testLocation, setTestLocation] = useState(null);

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
    subscribePedometer();
    subscribeAccelerometer();
    subscribeLocationUpdates();
    /*let timer = setInterval(() => updateUI() , 1000);
    return () => clearInterval(timer)*/
  }, []);

  //Subscribe Pedometer to count steps
  const subscribePedometer = () => {
    updateStepsListener = Pedometer.watchStepCount((updatedSteps) => {
      //console.log(updatedSteps);
      updateStepsCount(updatedSteps);
    });
  };

  //UnSubscriber Pedometer Updates
  const unSubscribePedometer = () => {
    setPrevStepsCount(0);
    if (updateStepsListener) {
      updateStepsListener.remove();
    }
  };

  //Pedometer's Updates Listener
  const updateStepsCount = (updatedSteps) => {
    console.log('============Update Steps Count===============');
    setPrevStepsCount((prevStepsCount) => {
      setStepsCount((stepsCount) => {
        console.log('============Steps Count=================');
        console.log(updatedSteps);
        console.log(prevStepsCount);
        console.log(stepsCount);
        setChangeInStepsCount(updatedSteps.steps - prevStepsCount);
        updateDistanceBasedonChangeInStepsCount(updatedSteps.steps - prevStepsCount);
        return stepsCount + (updatedSteps.steps - prevStepsCount);
      });
      return updatedSteps.steps;
    });
  };

  // Update distance once steps count changes
  const updateDistanceBasedonChangeInStepsCount=(changeInStepsCount)=>{
    if (changeInStepsCount > 0) {
      setToggleDistance(toggleDistance => !toggleDistance);
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
      var strideValue = height * strideMultiplyingFactor;
      console.log('===========Average Acceleration==============');
      console.log(averageAcceleration);
      console.log('===========Stride Multiplier==============');
      console.log(strideMultiplyingFactor);
      console.log('===========Stride Value==============');
      console.log(strideValue);

      var changeInDistanceInMeters = (changeInStepsCount * strideValue) / 100;
      console.log('===========Change In Number Of Steps==============');
      console.log(changeInStepsCount);
      console.log('===========Change In Distance in Meters==============');
      console.log(changeInDistanceInMeters);

      setRunDistance((prevDistance) => {
        console.log('===========Prev Distance==============');
        console.log(prevDistance);
        console.log('===========Change In Distance==============');
        console.log(changeInDistanceInMeters);
        return prevDistance + changeInDistanceInMeters;
      });
      //const distance=(stepsCount*78)/100;
      //setRunDistance(distance);
    }
  };

  //Subscriber for Location Updates
  const subscribeLocationUpdates = () => {
    updateLocationListener = Location.watchPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 10
    }, (updatedLocation) => {
      //console.log(updatedLocation);
      updateLocation(updatedLocation);
    });
  };

  //Location Update Listener
  const updateLocation = (updatedLocation) => {
    if (!isPaused) {
      let location = updatedLocation;
      setTestLocation(location);
      //console.log('=============Update Location==============');
      //console.log(location);
      let currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.000757,
        longitudeDelta: 0.0008,
        weight: 2
      };
      runPath = [...runPath, currentLocation];
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


  // Update averagePace and Calories once distance gets changed
  useEffect(() => {
    if (runDistance > 0) {
      //Update average pace
      const lapsedTimeinMinutes = runTotalTime / 60000;
      const averagePace = lapsedTimeinMinutes / (runDistance / 1000);
      if (averagePaceKmPerHour < 12.5) {
        setRunPace(averagePace);
      }
      //TODO : Update the formula to get weight from user details
      //Update Total Calories Burnt
      const lapsedTimeinHours = lapsedTimeinMinutes / 60;
      const averagePaceKmPerHour = (runDistance / 1000) / lapsedTimeinHours;
      const caloriesBurnt = parseInt((averagePaceKmPerHour * 3.5 * 68) / 200) * lapsedTimeinMinutes;
      setRunCaloriesBurnt(caloriesBurnt);
    }
  }, [runDistance]);


  //Method to Update UI each second based on accelerometer data
  const updateAccelerometerData = (accelerometerData) => {
    (async () => {
      DeviceMotion.setUpdateInterval(1000);
      //console.log('===========Auto Pause================');
      //console.log(timerForAutoPause);
      //console.log(runDistanceForAutoPause);
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

      //console.log(accelerometerData);

      let magnitude = Math.sqrt(accelerometerData.acceleration.x * accelerometerData.acceleration.x +
        accelerometerData.acceleration.y * accelerometerData.acceleration.y +
        accelerometerData.acceleration.z * accelerometerData.acceleration.z);

      /*let magnitudeIncludeAcclr = Math.sqrt(accelerometerData.accelerationIncludingGravity.x * accelerometerData.accelerationIncludingGravity.x +
          accelerometerData.accelerationIncludingGravity.y * accelerometerData.accelerationIncludingGravity.y +
          accelerometerData.accelerationIncludingGravity.z * accelerometerData.accelerationIncludingGravity.z);*/

      /*if (accelerationValues.length > 5) {
        accelerationValues.splice(0, 1);
      }*/
      accelerationValues.push(magnitude);
      const sum = accelerationValues.reduce((a, b) => a + b, 0);
      averageAcceleration = (sum / accelerationValues.length) || 0.3;

      //console.log(accelerometerData);
      console.log('===========magnitude============');
      //console.log(accelerometerData);
      console.log(magnitude);
      //console.log(magnitudeIncludeAcclr);
      /*console.log('===========Average============');
      console.log(averageAcceleration);*/

      // Update Location
      /*let location = await Location.getCurrentPositionAsync(
      {
        maximumAge: 10000, // only for Android
        accuracy: Location.Accuracy.Highest 
      })

      setTestLocation(location);

      if (location) {
        setToggleLocation(loc=>!loc);
        let currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.000757,
          longitudeDelta: 0.0008,
          weight: 2
        };

        let isToUpdatePath = false;
        
        if (runPath.length === 0) {
          isToUpdatePath = true;
        }
        
        //Calibrate here for accelerometer sensor
        // When Running
        else if (runPath.length > 0 && magnitude >  runLevel) {
          console.log("----------Adding------------");
          //console.log(accelerometerData);
          let endLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          };

          let startLocation={
        latitude: pathArray[pathArray.length-1].latitude,
        longitude: pathArray[pathArray.length-1].longitude
      };

          let lastLocationVar = {
            latitude: lastLocation.latitude,
            longitude: lastLocation.longitude
          }

          var haversineDistance=haversine(lastLocationVar, endLocation, {
            unit: 'meter'
          });
          temporaryDistance = temporaryDistance + haversineDistance;
          console.log('===============Update UI==================');
          console.log(haversineDistance);
          //Update UI to keep it live
          setRunDistance(runDistance => {
              //console.log(totalDistance+haversine(startLocation, endLocation, {unit: 'meter'}));
              return runDistance + 1;
            });

          runDistanceForAutoPause = runDistanceForAutoPause + 1;
          if (temporaryDistance >= 10) {
            isToUpdatePath = true;
            temporaryDistance = 0;
          }

        }
        if (isToUpdatePath) {
          runPath = [...runPath, currentLocation];
        }
        lastLocation = currentLocation;
        //return [...pathArray,currentLocation];});
        //}
      }*/
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
    unSubscribePedometer();
    accelerationValues = [];
    //console.log(updateLocationListener);
  };

  //Resume Run
  const resumeRun = () => {
    //setStartTime(Date.now());
    startTime = Date.now();
    setIsPaused(false);
    subscribeAccelerometer();
    subscribePedometer();
  };

  const increment = () => {
    setRunLevel(runLevel => runLevel + 1);
  };

  const decrement = () => {
    setRunLevel(runLevel => runLevel - 1);
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

  <TouchableOpacity style={styles.testButton1} onPress={()=>{increment()}}>
     <Text style={styles.textTest}>+</Text>
     <Text style={styles.textTest}>{runLevel}</Text>
  </TouchableOpacity>

   <TouchableOpacity style={styles.testButton2} onPress={()=>{decrement()}}>
     <Text style={styles.textTest}>-</Text>
     <Text style={styles.textTest}>{runLevel}</Text>
  </TouchableOpacity>
 
    <View style={styles.testPosition}>
     <Text>{stepsCount}</Text>
    </View>

  {toggleDistance?
  (<View style={styles.testDistanceUpdate}>
  </View>):(<View></View>)}

  {toggleLocation?
  (<View style={styles.testLocationUpdate}>
  </View>):(<View></View>)}

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
  },

  testButton1: {
    position: 'absolute',
    top: '63%',
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(80 / 2),
    borderColor: 'springgreen',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  testButton2: {
    position: 'absolute',
    top: '63%',
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(80 / 2),
    borderColor: 'springgreen',
    borderWidth: 2,
    backgroundColor: 'white',
    right: 2
  },
  textTest: {
    fontSize: moderateScale(20, 0.8),
    color: 'black',
    alignSelf: 'center'
  },
  testDistanceUpdate: {
    position: 'absolute',
    alignSelf: 'center',
    top: '5%',
    backgroundColor: 'red',
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: verticalScale(10 / 2),
  },
  testLocationUpdate: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    backgroundColor: 'green',
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: verticalScale(10 / 2),
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