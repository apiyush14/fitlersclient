import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer  } from 'expo-sensors';

const LiveRunTrackerScreen = props=>{

const [startTime, setStartTime]=useState(Date.now());
const [trackTimer, setTrackTimer]=useState({
	seconds: "00",
	minutes: "00",
	hours: "00"
});

const [pathArray, setPathArray] = useState([]);

const [totalDistance,setTotalDistance]=useState(0);
const haversine = require('haversine');

const subscribeAccelerometer = () => {
	Accelerometer.setUpdateInterval(1000);
    Accelerometer.addListener(accelerometerData => {
    updateUI(accelerometerData);
    });
  };


useEffect(() => {
	    subscribeAccelerometer();
        /*let timer = setInterval(() => updateUI() , 1000);
        return () => clearInterval(timer)*/
    }, []);

const updateUI=(accelerometerData)=>{
	(async ()=>{
    let lapsedTime=Date.now()-startTime;
    let secondsVar = ("0" + (Math.floor(lapsedTime / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(lapsedTime / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(lapsedTime / 3600000)).slice(-2);
    setTrackTimer(
    	{
    		seconds: secondsVar,
	        minutes: minutesVar,
	        hours: hoursVar
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
         longitudeDelta: 0.0008
		};

	 setPathArray(pathArray=>{
	 if(pathArray.length>1&&(accelerometerData.x>0.05||accelerometerData.y>0.05||accelerometerData.z>0.05))
	 {
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


const stopRun=()=>{
Accelerometer.removeAllListeners();	
props.navigation.navigate('RunTrackerHome');
};

/*console.log(haversine(start, end))
console.log(haversine(start, end, {unit: 'mile'}))
console.log(haversine(start, end, {unit: 'meter'}))*/
/*console.log(haversine(start, end, {threshold: 1}))
console.log(haversine(start, end, {threshold: 1, unit: 'mile'}))
console.log(haversine(start, end, {threshold: 1, unit: 'meter'}))*/


return (
         <View style={styles.liveRunTrackerContainer}>
         <View style={styles.stopRunButton}>
         <Button title='Stop Run' 
         onPress={()=>{stopRun()}}/>
         </View>
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
	},
	stopRunButton: {
        position: 'absolute',
        top: '75%',
        alignSelf: 'center',
        borderRadius: 50,
        backgroundColor: 'lightgrey',
        opacity: 1
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
	}
});

export default LiveRunTrackerScreen;