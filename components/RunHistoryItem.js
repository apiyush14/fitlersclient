import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground,Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


/*
Run History Card Item with shadow effects
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunHistoryItem=props=>{

const [trackTimer, setTrackTimer]=useState({
	seconds: "00",
	minutes: "00",
	hours: "00"
});

useEffect(() => {
         let secondsVar = ("0" + (Math.floor(props.lapsedTime / 1000) % 60)).slice(-2);
         let minutesVar = ("0" + (Math.floor(props.lapsedTime / 60000) % 60)).slice(-2);
         let hoursVar = ("0" + Math.floor(props.lapsedTime / 3600000)).slice(-2);
         setTrackTimer(
        {
            seconds: secondsVar,
            minutes: minutesVar,
            hours: hoursVar
        });
     },[]);

return(
 	<View style={styles.runHistoryItemContainer}>
 	<TouchableOpacity onPress={()=>{}}>
 	<View style={styles.trackImage}>
 	<ImageBackground
 	source={{uri:props.image}} 
 	style={styles.bgImage}>
 	</ImageBackground>
 	</View>
 	<View style={styles.calendar}>
 	 <Text style={styles.dayText}>{props.day}</Text>
 	 <View style={styles.calendarLine}>
 	 </View>
 	 <Text style={styles.dateText}>{props.date}</Text>
 	</View>
 	<View style={styles.runDetails}>
 	 <Text style={styles.distanceText}>Distance {parseFloat(props.totalDistance).toFixed(2)} KM</Text>
 	 <View style={styles.lapsedTimeView}>
 	 <View style={styles.timerIcon}>
 	 <Ionicons name="ios-stopwatch" size={24} color='grey'/>
 	 </View>
 	 <Text style={styles.lapsedTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
 	 </View>
 	</View>
 	</TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
 runHistoryItemContainer: {
 	height: windowHeight/6,
 	width: windowWidth/1.1,
 	backgroundColor: 'white',
 	borderRadius: 10,
 	marginHorizontal: 10,
 	marginBottom: 15,
 	opacity: 0.7,
 	shadowOffset: { width: 4, height: 4 },  
  shadowColor: 'black',  
  shadowOpacity: 0.7,
  shadowRadius: 2
 },
 trackImage: {
    width: '30%',
 },
 bgImage: {
 	width: '100%',
 	height: '100%',
    overflow: 'hidden',
    borderRadius: 10
 },
  runDetails: {
  	position: "absolute",
  	flexDirection: 'column',
  	alignSelf: 'center',
    width: '40%',
    height: '100%'
 },
 calendar: {
    width: '30%',
 	  height: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    position: "absolute",
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'lightgrey'
 },
 calendarLine: {
    borderWidth: 0.4,
    borderColor: 'lightgrey'
 },
 dateText: {
 	fontSize: 20,
 	alignSelf: 'center',
 	marginVertical: '15%'
 },
 dayText: {
 	fontSize: 18,
 	marginVertical: '5%',
 	alignSelf: 'center'
 },
 lapsedTimeView: {
   flex: 1,
   flexDirection: 'row'
 },
  distanceText: {
  	marginVertical: '5%',
  	marginHorizontal: '5%',
 	fontSize: 15
 },
 timerIcon: {
   marginHorizontal: '5%',
   marginVertical: '5%'
 },
 lapsedTimeText: {
 	fontSize: 17,
 	marginVertical: '7%',
 	marginHorizontal: '5%'
 }
});

export default RunHistoryItem;