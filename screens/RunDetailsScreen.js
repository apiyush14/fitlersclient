import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import { useDispatch } from 'react-redux';
import * as runActions from '../store/run-actions';
import Card from '../components/Card';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {useIsFocused} from "@react-navigation/native";

var isCalledFromHistoryScreen=false;
let runStartDateTime=null;
let runId=0;
let eventId=0;

let mapRef=null;

const TESTPOINTS = [
{latitude: 31.624708978431634, longitude: 74.87492581820307},
{latitude:31.624808978431635, longitude:74.87502581820307},
{latitude:31.624908978431636, longitude:74.87512581820307},
{latitude:31.625008978431637, longitude:74.87522581820307},
{latitude:31.625208978431640, longitude:74.87532581820307},
{latitude:31.625308978431645, longitude:74.87542581820307},
{latitude:31.625408978431647, longitude:74.87552581820307},
{latitude:31.625608978431648, longitude:74.87562581820307},
{latitude:31.625708978431649, longitude:74.87572581820307},
{latitude:31.625808978431656, longitude:74.87582581820307},
{latitude:31.625908978431664, longitude:74.87592581820307},
{latitude:31.626008978431667, longitude:74.87602581820307},
{latitude:31.626109998432674, longitude:74.87612581820307},

{latitude:31.626008978431667, longitude:74.87602581820307},
{latitude:31.625908978431664, longitude:74.87612581820307},
{latitude:31.625808978431664, longitude:74.87622581820307},
{latitude:31.625708978431664, longitude:74.87632581820307},
{latitude:31.625608978431664, longitude:74.87632581820307},
{latitude:31.625508978431664, longitude:74.87652581820307},
{latitude:31.625408978431664, longitude:74.87662581820307},
{latitude:31.625308978431664, longitude:74.87672581820307},
{latitude:31.625208978431664, longitude:74.87682581820307},
{latitude:31.625108978431664, longitude:74.87692581820307},
{latitude:31.625008978431664, longitude:74.87702581820307}
];

const RunDetailsScreen = props=>{

// State Selectors
const eventResultDetails = useSelector(state => state.events.eventResultDetails); 

const dispatch = useDispatch();

//State Variables
//const [mapState,setMapState]=useState(null);
const [runPath, setRunPath]=useState([]);
const [mapRegion, setMapRegion]=useState(null);
const [runDate, setRunDate]=useState(null);
const [runDay, setRunDay]=useState(null);
const [runDistance,setRunDistance]=useState(0);
const [runTotalTime, setRunTotalTime]=useState(0);
const [runCaloriesBurnt,setRunCaloriesBurnt]=useState(0);
const [runPace, setRunPace]=useState(0.00);
const [userRank, setUserRank]=useState(0);
const [isEvent, setIsEvent]=useState(false);
const [trackTimer, setTrackTimer]=useState({
  seconds: "00",
  minutes: "00",
  hours: "00"
});

//Load Screen Use Effect hook used to populate state variables
useEffect(() => {
  
  console.log(props.route);

  if(props.route.params.sourceScreen){
    if(props.route.params.sourceScreen==='RunHistoryScreen'){
      isCalledFromHistoryScreen=true;
    }
  }

  if(props.route.params.eventId){
    var eventResult=eventResultDetails.find(eventResult=>eventResult.runId===props.route.params.runId);
    setUserRank(eventResult!==undefined?eventResult.userRank:0);
    setIsEvent(true);
  }

  if(props.route.params.runPath)
  {
    const pathArray=props.route.params.runPath;
    setRunPath(pathArray);
    setRunDate(props.route.params.runDate);
    setRunDay(props.route.params.runDay);
    setRunDistance(props.route.params.runDistance);
    setRunPace(props.route.params.runPace);
    setRunCaloriesBurnt(props.route.params.runCaloriesBurnt);

    setMapRegion({
     latitude: pathArray[Math.floor(pathArray.length/2)].latitude,
     longitude: pathArray[Math.floor(pathArray.length/2)].longitude,
     latitudeDelta: Math.abs(pathArray[pathArray.length-1].latitude-pathArray[0].latitude)+0.005,
     longitudeDelta: Math.abs(pathArray[pathArray.length-1].longitude-pathArray[0].longitude)+0.005
   });
    
    runStartDateTime=props.route.params.runStartDateTime;
    runId=props.route.params.runId;
    eventId=props.route.params.eventId;
    var runTotalTimeVar=props.route.params.runTotalTime;
    let secondsVar = ("0" + (Math.floor(runTotalTimeVar / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(runTotalTimeVar / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(runTotalTimeVar / 3600000)).slice(-2);
    setTrackTimer(
    {
      seconds: secondsVar,
      minutes: minutesVar,
      hours: hoursVar
    });
    setRunTotalTime(runTotalTimeVar);
  }

       //To be removed
       if(!isCalledFromHistoryScreen){
         console.log('Setting Up Run Path');
         setRunPath(TESTPOINTS);
       }
       
     }, [props.route.params]);

//Use effect hook for taking a snapshot of the map
useEffect(() => {
 if(runPath.length>0&&(!isCalledFromHistoryScreen)){
   takeSnapshot();
 }
}, [runPath]);

//Method to take a snapshot and call save method
const takeSnapshot=()=>{
  const snapshot = mapRef.takeSnapshot({
   // width: 300,      // optional, when omitted the view-width is used
   // height: 300,     // optional, when omitted the view-height is used
    format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
    quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
    result: 'file'   // result types: 'file', 'base64' (default: 'file')
  });
  snapshot.then((uri) => {
    //setMapState(uri);
    //savePlaceHandler(uri,date,day,lapsedTime,totalDistance,averagePace,caloriesBurnt,path);
    savePlaceHandler(runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,null,runStartDateTime,runDate,runDay,runPath,uri,eventId);
  });
};

//Method to dispatch Add Run
const savePlaceHandler = (runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runStartDateTime,runDate,runDay,runPath,runTrackSnapUrl,eventId) => {
  dispatch(runActions.addRun(runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runStartDateTime,runDate,runDay,runPath,runTrackSnapUrl,eventId));
};

//View
return (
 <View style={styles.runDetailsContainerStyle}>

  <MapView style={styles.mapContainerStyle} region={mapRegion} ref={map => {mapRef = map }}
   pitchEnabled={true} rotateEnabled={true} zoomEnabled={true} scrollEnabled={true}>
   {runPath?(
   <Polyline 
   strokeWidth={5}
   strokeColor='red'
   coordinates={runPath}/>):(<View></View>)}
   {runPath[0]!==undefined?(
   <Marker pinColor='green' coordinate={runPath[0]}/>):(<View></View>)}
   {runPath[runPath.length-1]!==undefined?(
   <Marker pinColor='red' coordinate={runPath[runPath.length-1]}/>):(<View></View>)}
  </MapView>

 <View style={styles.scrollViewContainerStyle}>
  <ScrollView style={styles.runMetricsContainerStyle}>
   {isEvent&&userRank>0?(

   <View style={styles.rowStyle}>
    <Card style={{width:'97%'}}>
      <Ionicons name="ios-trophy" size={25} color='springgreen'/>
      <Text style={styles.largeTextStyle}>{userRank}</Text>
      <Text style={styles.mediumTextStyle}>Rank</Text>
    </Card>
   </View>):(<View></View>)}

   <View style={styles.rowStyle}>
    <Card style={{width:'60%'}}>
     <Ionicons name="ios-walk" size={30} color='springgreen'/>
     <Text style={styles.largeTextStyle}>{parseFloat(runDistance/1000).toFixed(2)} KM</Text>
    </Card>

    <Card style={{width:'35%'}}>
     <Ionicons name="ios-stopwatch" size={20} color='springgreen'/>
     <Text style={styles.mediumTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
     <Text style={styles.smallTextStyle}>HH:MM:SS</Text>
    </Card>
   </View>

   <View style={styles.rowStyle}>
    <Card style={{width:'35%'}}>
      <Ionicons name="ios-calendar" size={25} color='springgreen'/>
      <Text style={styles.mediumTextStyle}>{runDate}</Text>
      <Text style={styles.mediumTextStyle}>{runDay}</Text>
    </Card>

    <Card style={{width:'25%'}}>
      <Ionicons name="ios-flame" size={25} color='springgreen'/>
      <Text style={styles.mediumTextStyle}>{runCaloriesBurnt}</Text>
      <Text style={styles.mediumTextStyle}>Calories</Text>
    </Card>

    <Card style={{width:'33%'}}>
      <Ionicons name="ios-speedometer" size={25} color='springgreen'/>
      <Text style={styles.mediumTextStyle}>{parseFloat(runPace).toFixed(2)}</Text>
      <Text style={styles.mediumTextStyle}>Pace</Text>
    </Card>

   </View>
  </ScrollView>
 </View>
 </View>
);
};

const styles = StyleSheet.create({
  runDetailsContainerStyle: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },

  mapContainerStyle: {
    flex: 0.4,
    borderRadius: 20
  },
  scrollViewContainerStyle: {
    flex: 0.6
  },
  runMetricsContainerStyle: {
    flexDirection: 'column',
    alignSelf: 'center'
  },

  rowStyle: {
    flex: 1,
    height: '30%',
    flexDirection: 'row',
    alignItems: 'center'
  },

  largeTextStyle: {
    fontSize: moderateScale(40, 0.8),
    color: 'springgreen'
  },
  mediumTextStyle: {
    fontSize: moderateScale(17, 0.8),
    color: 'springgreen'
  },
  smallTextStyle: {
    padding: '3%',
    fontSize: moderateScale(10, 0.8),
    color: 'springgreen'
  }

});

export default RunDetailsScreen;