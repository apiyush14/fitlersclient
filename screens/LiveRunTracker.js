import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Switch} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer  } from 'expo-sensors';
import Slider from '../components/Slider';
import RoundButton from '../components/RoundButton';
import { Ionicons } from '@expo/vector-icons';

const LiveRunTrackerScreen = props=>{

const [isPaused,setIsPaused]=useState(false);
const [startTime, setStartTime]=useState(Date.now());
const [lapsedTime, setLapsedTime]=useState(0);
const [trackTimer, setTrackTimer]=useState({
	seconds: "00",
	minutes: "00",
	hours: "00"
});
const [date, setDate]=useState(null);
const [day, setDay]=useState(null);
const [pathArray, setPathArray] = useState([]);
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

const [totalDistance,setTotalDistance]=useState(0);
const haversine = require('haversine');

const subscribeAccelerometer = () => {
	Accelerometer.setUpdateInterval(1000);
    Accelerometer.addListener(accelerometerData => {
    updateUI(accelerometerData);
    });
  };

const unSubscribeAccelerometer = () => {
   Accelerometer.removeAllListeners();
  };

useEffect(() => {
        var today = new Date();
        var dateFull=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
        setDate(dateFull);
        setDay(weekday[today.getDay()]);
	    subscribeAccelerometer();
        /*let timer = setInterval(() => updateUI() , 1000);
        return () => clearInterval(timer)*/
    }, []);


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

    let {status} = await Location.requestPermissionsAsync();
	if(status!=='granted')
	{
     console.log("Permission Not granted");
	}
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

	 setPathArray(pathArray=>{
	 if(pathArray.length>1&&(accelerometerData.x>0.5||accelerometerData.y>0.5||accelerometerData.z>0.5))
	 {
        console.log(accelerometerData);
       let endLocation={
        latitude: pathArray[pathArray.length-1].latitude,
        longitude: pathArray[pathArray.length-1].longitude
       };

       let startLocation={
        latitude: pathArray[pathArray.length-2].latitude,
        longitude: pathArray[pathArray.length-2].longitude
       };
        setTotalDistance(totalDistance=>{
        console.log(totalDistance+haversine(startLocation, endLocation, {unit: 'meter'}));
       	return totalDistance+haversine(startLocation, endLocation, {unit: 'meter'});
       });
     }
	 	return [...pathArray,currentLocation];});
	}
	
    }
    )();
};

const [isEnabled, setIsEnabled] = useState(false);
const toggleSwitch = () => setIsEnabled(previousState => !previousState);


const stopRun=()=>{
//Accelerometer.removeAllListeners();
props.navigation.navigate('RunDetailsScreen', {
    path:pathArray,
    date:date,
    day:day,
    lapsedTime:lapsedTime,
    totalDistance:totalDistance
    });
};

const pauseRun=()=>{
setIsPaused(true);
unSubscribeAccelerometer();
};

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
             <Ionicons name="ios-pause" size={48} color='white'/>
            </TouchableOpacity>
           ):
         (
            <TouchableOpacity style={styles.pauseResumeRunButton} onPress={()=>{resumeRun()}}>
             <Ionicons name="ios-play" size={48} color='white'/>
            </TouchableOpacity>
           )
         }
         {isPaused?
         (<View style={styles.sliderContainer}>
         <Slider
         sliderAction={stopRun}
         buttonTitle='Stop' 
         bounceValue='220' 
         image='https://c0.wallpaperflare.com/preview/929/411/615/athletic-field-ground-lane-lines.jpg'/>
         </View>):(<View></View>)
         }
         <Text style={styles.elapsedTime}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
         <Text style={styles.totalDistanceText}>Total Distance</Text>
         <Text style={styles.totalDistance}>{parseFloat(totalDistance).toFixed(2)}</Text>
         </View>
		);
};

const styles = StyleSheet.create({
	liveRunTrackerContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'lightgreen'
	},
	pauseResumeRunButton: {
        position: 'absolute',
        top: '65%',
        alignSelf: 'center',
        opacity: 0.7,
        width: 90,
        height: 90,
        borderRadius: 90/2,
        justifyContent: 'center',
        backgroundColor: 'black',
        alignItems: 'center'
	},
	elapsedTime: {
		position: 'absolute',
        top: '15%',
        fontSize: 30,
        alignSelf: 'center',
	},
	totalDistance: {
		position: 'absolute',
        top: '50%',
        fontSize: 50,
        alignSelf: 'center',
	},
	totalDistanceText: {
		position: 'absolute',
        top: '40%',
        fontSize: 40,
        alignSelf: 'center',
	},
    sliderContainer: {
        top: '80%'
    }
});

export default LiveRunTrackerScreen;