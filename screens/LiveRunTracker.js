import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';
import Slider from '../components/Slider';
import RoundButton from '../components/RoundButton';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

let runTotalTime=0;
let runPath=[];
let startTime=Date.now();
let lastLocation={};
let temporaryDistance=0;
let runDate=null;
let runDay=null;

const LiveRunTrackerScreen = props=>{

    const [isPaused,setIsPaused]=useState(false);
    const [runDistance,setRunDistance]=useState(0);
    const [runPace,setRunPace]=useState(0.00);
    const [runCaloriesBurnt,setRunCaloriesBurnt]=useState(0);
    const [trackTimer, setTrackTimer]=useState({
       seconds: "00",
       minutes: "00",
       hours:   "00"
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

//Method to Subscribe to Accelerometer and add a listener to update every second
const subscribeAccelerometer = () => {
	DeviceMotion.setUpdateInterval(1000);
    DeviceMotion.addListener(accelerometerData => {
        updateUI(accelerometerData);
    });
};

//Method to Unsubscriber to Accelerometer
const unSubscribeAccelerometer = () => {
 DeviceMotion.removeAllListeners();
};

//Load Time useEffect hook
useEffect(() => {
    var today = new Date();
    runDate=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
    runDay=weekday[today.getDay()];

    runTotalTime=0;
    runPath=[];
    startTime=Date.now();

    subscribeAccelerometer();

        /*let timer = setInterval(() => updateUI() , 1000);
        return () => clearInterval(timer)*/
    }, []);

// Update averagePace and Calories once distance gets changed
useEffect(() => {
    if(runDistance>0){
        //Update average pace
        const lapsedTimeinMinutes=runTotalTime / 60000;
        const averagePace=lapsedTimeinMinutes/(runDistance/1000);
        setRunPace(averagePace);
        
        //TODO : Update the formula
        //Update Total Calories Burnt
        const caloriesBurnt=parseInt(65+(16/averagePace));
        setRunCaloriesBurnt(caloriesBurnt);
    }
}, [runDistance]);


//Method to Update UI each second based on accelerometer data
const updateUI=(accelerometerData)=>{
	(async ()=>{
       const currentTime=Date.now();
       let updatedLapsedTime=runTotalTime+(currentTime-startTime);
       let secondsVar = ("0" + (Math.floor(updatedLapsedTime / 1000) % 60)).slice(-2);
       let minutesVar = ("0" + (Math.floor(updatedLapsedTime / 60000) % 60)).slice(-2);
       let hoursVar = ("0" + Math.floor(updatedLapsedTime / 3600000)).slice(-2);

       setTrackTimer(
       {
        seconds: secondsVar,
        minutes: minutesVar,
        hours: hoursVar
    });

       runTotalTime= updatedLapsedTime;
       startTime= currentTime;

    // Update Location
    let location = await Location.getCurrentPositionAsync({});

    if(location)
    {
      let currentLocation=
      {
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
       latitudeDelta: 0.000757,
       longitudeDelta: 0.0008,
       weight: 2
   };
   
     //Performance handling to not store data if location is not changed (can be calibrated)
     let isToUpdatePath= false;
     console.log(accelerometerData);
     
     let magnitude=Math.sqrt(accelerometerData.acceleration.x*accelerometerData.acceleration.x
        + accelerometerData.acceleration.y*accelerometerData.acceleration.y
        + accelerometerData.acceleration.z*accelerometerData.acceleration.z);

     let magnitudeIncludeAcclr=Math.sqrt(accelerometerData.acceleration.x*accelerometerData.acceleration.x
        + accelerometerData.acceleration.y*accelerometerData.acceleration.y
        + accelerometerData.acceleration.z*accelerometerData.acceleration.z);
     
     //console.log(accelerometerData);
     if(runPath.length===0){
      isToUpdatePath=true;
  }

     //Calibrate here for accelerometer sensor
     // When Running
     else if(runPath.length>0&&magnitude>6)
     {
        /*console.log("----------Adding------------");
        console.log(accelerometerData);*/
        let endLocation={
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
        };

       /*let startLocation={
        latitude: pathArray[pathArray.length-1].latitude,
        longitude: pathArray[pathArray.length-1].longitude
    };*/

    let lastLocationVar={
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude
    }
    temporaryDistance=temporaryDistance+haversine(lastLocationVar, endLocation, {unit: 'meter'});
    if(temporaryDistance>=10){
       isToUpdatePath=true;
       setRunDistance(runDistance=>{
              //console.log(totalDistance+haversine(startLocation, endLocation, {unit: 'meter'}));
              return runDistance+temporaryDistance;
          });
       temporaryDistance=0;
   }
   
}
if(isToUpdatePath){
    runPath=[...runPath,currentLocation];
}
lastLocation=currentLocation;
	 	//return [...pathArray,currentLocation];});
    //}
}
}
)();
};

//Complete the run and load Run Details Screen
const stopRun=()=>{
//Accelerometer.removeAllListeners();
props.navigation.navigate('RunDetailsScreen', {
    runPath:runPath,
    runDate:runDate,
    runDay:runDay,
    runTotalTime:runTotalTime,
    runDistance:runDistance,
    runPace:runPace,
    runCaloriesBurnt: runCaloriesBurnt
});
};

// Pause Run
const pauseRun=()=>{
   setIsPaused(true);
   unSubscribeAccelerometer();
};

//Resume Run
const resumeRun=()=>{
//setStartTime(Date.now());
startTime=Date.now();
setIsPaused(false);
subscribeAccelerometer();
};

/*console.log(haversine(start, end))
console.log(haversine(start, end, {unit: 'mile'}))
console.log(haversine(start, end, {unit: 'meter'}))*/
/*console.log(haversine(start, end, {threshold: 1}))
console.log(haversine(start, end, {threshold: 1, unit: 'mile'}))
console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))*/


return (
   <View style={styles.liveRunTrackerContainer}>
   {!isPaused?
       (
        <TouchableOpacity style={styles.pauseResumeRunButton} onPress={()=>{pauseRun()}}>
        <Ionicons name={Platform.OS === 'android'?"md-pause":"ios-pause"}
        size={48} color='white'/>
        </TouchableOpacity>
        ):
        (
        <TouchableOpacity style={styles.pauseResumeRunButton} onPress={()=>{resumeRun()}}>
        <Ionicons name={Platform.OS === 'android'?"md-play":"ios-play"}
        size={48} color='white'/>
        </TouchableOpacity>
        )
    }
    {isPaused?
       (<View style={styles.sliderContainer}>
       <Slider
       sliderAction={stopRun}
       buttonTitle='Stop' 
       bounceValue={220} 
       />
       </View>):(<View></View>)
   }
   <View style={styles.runTotalTimeContainer}>
   <View style={styles.timerIcon}>
   <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"}
   size={24} color='lightgrey'/>
   </View>
   <Text style={styles.runTotalTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
   </View>

   <View style={styles.runPaceContainer}>
   <View style={styles.paceIcon}>
   <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"}
   size={24} color='lightgrey'/>
   </View>
   <Text style={styles.runPaceText}>{parseFloat(runPace).toFixed(2)}</Text>
   </View>

   <View style={styles.circleContainerForDistance}>
   <Text style={styles.runDistance}>{parseFloat(runDistance/1000).toFixed(2)}</Text>
   <Text style={styles.kmText}>KM</Text>
   </View>
   </View>
   );
};

const styles = StyleSheet.create({
	liveRunTrackerContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },

    pauseResumeRunButton: {
        position: 'absolute',
        top: '63%',
        alignSelf: 'center',
        opacity: 0.7,
        width: 80,
        height: 80,
        borderRadius: 80/2,
        borderColor: 'springgreen',
        borderWidth: 2,
        justifyContent: 'center',
        backgroundColor: 'black',
        alignItems: 'center',
        shadowColor: 'springgreen',
        shadowOffset: {width:1,height:2},
        shadowOpacity:1,
        shadowRadius:6
    },
    runTotalTimeContainer: {
        position: 'absolute',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        right: '10%',
        top: '7%'
    },
    timerIcon: {
        alignSelf: 'center',
    },
    runTotalTimeText: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'lightgrey'
    },
    runPaceContainer: {
        position: 'absolute',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        top: '7%',
        left: '10%'
    },
    paceIcon: {
        alignSelf: 'center',
    },
    runPaceText: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'lightgrey'
    },
    circleContainerForDistance: {
        position: 'absolute',
        top: '25%',
        alignSelf: 'center',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'springgreen',
        backgroundColor: 'black',
        shadowColor: 'springgreen',
        shadowOffset: {width:1,height:2},
        shadowOpacity:1,
        shadowRadius:6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    runDistance: {
      fontSize: 50,
      alignSelf: 'center',
      color: 'lightgrey'
  },
  kmText: {
      fontSize: 40,
      alignSelf: 'center',
      color: 'lightgrey'
  },
  sliderContainer: {
    top: '80%'
}
});

export default LiveRunTrackerScreen;