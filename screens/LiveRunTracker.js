import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Platform} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer, DeviceMotion  } from 'expo-sensors';
import Slider from '../components/Slider';
import RoundButton from '../components/RoundButton';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

const LiveRunTrackerScreen = props=>{

const [isPaused,setIsPaused]=useState(false);
const [startTime, setStartTime]=useState(Date.now());
const [lapsedTime, setLapsedTime]=useState(0);
const [date, setDate]=useState(null);
const [day, setDay]=useState(null);
const [pathArray, setPathArray] = useState([]);
const [totalDistance,setTotalDistance]=useState(0);
const [averagePace,setAveragePace]=useState(0.00);
const [caloriesBurnt,setCaloriesBurnt]=useState(0);
const [isEnabled, setIsEnabled] = useState(false);

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

//Method to Subscriber to Accelerometer and add a listener to update every second
const subscribeAccelerometer = () => {

     let status =Permissions.askAsync(Permissions.MOTION);

     //TODO : To fix async
      /*  if(status!=='granted')
        {
          //TODO : Add Alert
          console.log("Permission Not granted");
        }*/

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
        var dateFull=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
        setDate(dateFull);
        setDay(weekday[today.getDay()]);

        subscribeAccelerometer();

        /*let {status} = await Location.requestPermissionsAsync();
        if(status!=='granted')
        {
          //TODO : Add Alert
          console.log("Permission Not granted");
        }*/
       
        /*let timer = setInterval(() => updateUI() , 1000);
        return () => clearInterval(timer)*/
    }, []);

// Update averagePace and Calories once distance gets changed
useEffect(() => {
        if(totalDistance>0){
        //Update average pace
        const lapsedTimeinMinutes=lapsedTime / 60000;
        const averagePace=lapsedTimeinMinutes/(totalDistance/1000);
        setAveragePace(averagePace);
        
        //Update Total Calories Burnt
        const caloriesBurnt=parseInt(65+(16/averagePace));
        setCaloriesBurnt(caloriesBurnt);
        }
    }, [totalDistance]);


//Method to Update UI each second based on accelerometer data
const updateUI=(accelerometerData)=>{
	(async ()=>{

    setStartTime(startTime=>{
         const currentTime=Date.now();
         setLapsedTime(lapsedTime=>{
         let updatedLapsedTime=lapsedTime+(currentTime-startTime);
         let secondsVar = ("0" + (Math.floor(updatedLapsedTime / 1000) % 60)).slice(-2);
         let minutesVar = ("0" + (Math.floor(updatedLapsedTime / 60000) % 60)).slice(-2);
         let hoursVar = ("0" + Math.floor(updatedLapsedTime / 3600000)).slice(-2);
         setTrackTimer(
        {
            seconds: secondsVar,
            minutes: minutesVar,
            hours: hoursVar
        });
         return updatedLapsedTime;   
         });
         return currentTime;
    });

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
      if(pathArray.length==0||(pathArray.length>0
        &&(Math.abs(pathArray[pathArray.length-1].latitude-location.coords.latitude))>0
        &&(Math.abs(pathArray[pathArray.length-1].longitude-location.coords.longitude))>0))
      {
        isToUpdatePath=true;
      }

    if(isToUpdatePath){
      // Update path array with new co-ordinates
	  setPathArray(pathArray=>{


      let magnitude=Math.sqrt(accelerometerData.acceleration.x*accelerometerData.acceleration.x
        + accelerometerData.acceleration.y*accelerometerData.acceleration.y
        + accelerometerData.acceleration.z*accelerometerData.acceleration.z);

     let magnitudeIncludeAcclr=Math.sqrt(accelerometerData.acceleration.x*accelerometerData.acceleration.x
        + accelerometerData.acceleration.y*accelerometerData.acceleration.y
        + accelerometerData.acceleration.z*accelerometerData.acceleration.z);
     
     //Calibrate here for accelerometer sensor
     /*console.log("----------Blocking------------");
     console.log(accelerometerData);*/
	 if(pathArray.length>1&&magnitude>6)
	 {
        /*console.log("----------Adding------------");
        console.log(accelerometerData);*/
       let endLocation={
        latitude: pathArray[pathArray.length-1].latitude,
        longitude: pathArray[pathArray.length-1].longitude
       };

       let startLocation={
        latitude: pathArray[pathArray.length-2].latitude,
        longitude: pathArray[pathArray.length-2].longitude
       };
        setTotalDistance(totalDistance=>{
        //console.log(totalDistance+haversine(startLocation, endLocation, {unit: 'meter'}));
       	return totalDistance+haversine(startLocation, endLocation, {unit: 'meter'});
       });
     }
	 	return [...pathArray,currentLocation];});
    }
	}
	
    }
    )();
};

//Complete the run and load Run Details Screen
const stopRun=()=>{
//Accelerometer.removeAllListeners();
props.navigation.navigate('RunDetailsScreen', {
    path:pathArray,
    date:date,
    day:day,
    lapsedTime:lapsedTime,
    totalDistance:totalDistance,
    averagePace:averagePace,
    caloriesBurnt: caloriesBurnt
    });
};

// Pause Run
const pauseRun=()=>{
setIsPaused(true);
unSubscribeAccelerometer();
};

//Resume Run
const resumeRun=()=>{
setStartTime(Date.now());
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
         bounceValue='220' 
         />
         </View>):(<View></View>)
         }
         <View style={styles.timerContainer}>
          <View style={styles.timerIcon}>
          <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"}
           size={24} color='lightgrey'/>
          </View>
          <Text style={styles.elapsedTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
         </View>

         <View style={styles.averagePaceContainer}>
          <View style={styles.paceIcon}>
          <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"}
           size={24} color='lightgrey'/>
          </View>
          <Text style={styles.averagePaceText}>{parseFloat(averagePace).toFixed(2)}</Text>
         </View>

         <View style={styles.circleContainerForDistance}>
          <Text style={styles.totalDistance}>{parseFloat(totalDistance/1000).toFixed(2)}</Text>
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
    timerContainer: {
        position: 'absolute',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        right: '10%',
        top: '7%'
    },
    timerIcon: {
        alignSelf: 'center',
    },
	elapsedTimeText: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'lightgrey'
	},
    averagePaceContainer: {
        position: 'absolute',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        top: '7%',
        left: '10%'
    },
    paceIcon: {
        alignSelf: 'center',
    },
    averagePaceText: {
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
        shadowRadius:6
    },
	totalDistance: {
		position: 'absolute',
        top: '35%',
        fontSize: 50,
        alignSelf: 'center',
        color: 'lightgrey'
	},
	kmText: {
		position: 'absolute',
        top: '65%',
        fontSize: 40,
        alignSelf: 'center',
        color: 'lightgrey'
	},
    sliderContainer: {
        top: '80%'
    }
});

export default LiveRunTrackerScreen;