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
const [averagePace,setAveragePace]=useState(0.00);

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


useEffect(() => {
        if(totalDistance>0){
        const lapsedTimeinHours=lapsedTime / 3600000;
        const averagePace=(totalDistance/1000)/lapsedTimeinHours;
        setAveragePace(averagePace);
        }
    }, [totalDistance]);


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
        //console.log(accelerometerData);
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
    totalDistance:totalDistance,
    averagePace:averagePace
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
         <View style={styles.timerContainer}>
          <View style={styles.timerIcon}>
          <Ionicons name="ios-stopwatch" size={24} color='lightgrey'/>
          </View>
          <Text style={styles.elapsedTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
         </View>

         <View style={styles.averagePaceContainer}>
          <View style={styles.paceIcon}>
          <Ionicons name="ios-speedometer" size={24} color='lightgrey'/>
          </View>
          <Text style={styles.averagePaceText}>{parseFloat(averagePace).toFixed(2)}</Text>
         </View>

         <View style={styles.circleContainerForDistance}>
         <Text style={styles.totalDistance}>{parseFloat(totalDistance).toFixed(2)}</Text>
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