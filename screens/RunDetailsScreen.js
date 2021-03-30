import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Platform, ImageBackground} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import { useDispatch } from 'react-redux';
import * as runActions from '../store/run-actions';
import Card from '../components/Card';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {useIsFocused} from "@react-navigation/native";
import RunDetails from '../models/rundetails';

var isCalledFromHistoryScreen = false;
let runStartDateTime = null;
let runId = 0;
let eventId = 0;
let runDetails = null;

const RunDetailsScreen = props=>{

  // State Selectors
  const eventResultDetails = useSelector(state => state.events.eventResultDetails);

  const dispatch = useDispatch();

  //State Variables
  //const [mapState,setMapState]=useState(null);
  const [runPath, setRunPath] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [runDate, setRunDate] = useState(null);
  const [runDay, setRunDay] = useState(null);
  const [runDistance, setRunDistance] = useState(0);
  const [runTotalTime, setRunTotalTime] = useState(0);
  const [runCaloriesBurnt, setRunCaloriesBurnt] = useState(0);
  const [runPace, setRunPace] = useState(0.00);
  const [userRank, setUserRank] = useState(0);
  const [isEvent, setIsEvent] = useState(false);
  const [trackTimer, setTrackTimer] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00"
  });

  //Load Screen Use Effect hook used to populate state variables
  useEffect(() => {

    runDetails = props.route.params.runDetails;
    if (props.route.params.sourceScreen) {
      if (props.route.params.sourceScreen === 'RunHistoryScreen') {
        isCalledFromHistoryScreen = true;
      }
    }

    if (runDetails.eventId > 0) {
      var eventResult = eventResultDetails.find(eventResult => eventResult.runId === runDetails.runId);
      setUserRank(eventResult !== undefined ? eventResult.userRank : 0);
      setIsEvent(true);
    }

    if (runDetails.runDistance) {
      const pathArray = runDetails.runPath;
      //To handle No Location Available Scenario
      if (pathArray.length > 0) {
        setRunPath(pathArray);
        setMapRegion({
          latitude: pathArray[Math.floor(pathArray.length / 2)].latitude,
          longitude: pathArray[Math.floor(pathArray.length / 2)].longitude,
          latitudeDelta: Math.abs(pathArray[pathArray.length - 1].latitude - pathArray[0].latitude) + 0.005,
          longitudeDelta: Math.abs(pathArray[pathArray.length - 1].longitude - pathArray[0].longitude) + 0.005
        });
      }

      setRunDate(runDetails.runDate);
      setRunDay(runDetails.runDay);
      setRunDistance(runDetails.runDistance);
      setRunPace(runDetails.runPace);
      setRunCaloriesBurnt(runDetails.runCaloriesBurnt);

      runStartDateTime = runDetails.runStartDateTime;
      runId = runDetails.runId;
      eventId = runDetails.eventId;
      var runTotalTimeVar = runDetails.runTotalTime;
      let secondsVar = ("0" + (Math.floor(runTotalTimeVar / 1000) % 60)).slice(-2);
      let minutesVar = ("0" + (Math.floor(runTotalTimeVar / 60000) % 60)).slice(-2);
      let hoursVar = ("0" + Math.floor(runTotalTimeVar / 3600000)).slice(-2);
      setTrackTimer({
        seconds: secondsVar,
        minutes: minutesVar,
        hours: hoursVar
      });
      setRunTotalTime(runTotalTimeVar);
    }
    saveRun();
  }, [props.route.params]);

  //Method to save Run In Local DB and Server
  const saveRun = () => {
    if ((!isCalledFromHistoryScreen)) {
      dispatch(runActions.addRun(runDetails)).then((response) => {
        if (response.status >= 400) {
          Alert.alert("Run Not Saved", "Sorry, we could not save this Run!!!");
        }
      });
    }
  };

//View
return (
 <View style={styles.runDetailsContainerStyle}>
  {runPath&&runPath.length>0?(
  <MapView style={styles.mapContainerStyle} region={mapRegion}
   pitchEnabled={true} rotateEnabled={true} zoomEnabled={true} scrollEnabled={true}>
   <Polyline 
   strokeWidth={5}
   strokeColor='red'
   coordinates={runPath}/>
   {runPath[0]!==undefined?(
   <Marker pinColor='green' coordinate={runPath[0]}/>):(<View></View>)}
   {runPath[runPath.length-1]!==undefined?(
   <Marker pinColor='red' coordinate={runPath[runPath.length-1]}/>):(<View></View>)}
  </MapView>):
   <View style={styles.mapContainerStyle}>
    <ImageBackground 
      source={require('../assets/images/no_location.jpg')} 
      style={styles.bgImage}>
     </ImageBackground>
   </View>}

 <View style={styles.scrollViewContainerStyle}>
  <ScrollView style={styles.runMetricsContainerStyle}>
   {isEvent&&userRank>0?(

   <View style={styles.rowStyle}>
    <Card style={{width:'97%'}}>
      <Ionicons name={Platform.OS === 'android'?"md-trophy":"ios-trophy"} size={25} color='springgreen'/>
      <Text style={styles.largeTextStyle}>{userRank}</Text>
      <Text style={styles.mediumTextStyle}>Rank</Text>
    </Card>
   </View>):(<View></View>)}

   <View style={styles.rowStyle}>
    <Card style={{width:'60%'}}>
     <Ionicons name={Platform.OS === 'android'?"md-walk":"ios-walk"} size={30} color='springgreen'/>
     <Text style={styles.largeTextStyle}>{parseFloat(runDistance/1000).toFixed(2)} KM</Text>
    </Card>

    <Card style={{width:'35%'}}>
     <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"} size={20} color='springgreen'/>
     <Text style={styles.mediumTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
     <Text style={styles.smallTextStyle}>HH:MM:SS</Text>
    </Card>
   </View>

   <View style={styles.rowStyle}>
    <Card style={{width:'35%'}}>
      <Ionicons name={Platform.OS === 'android'?"md-calendar":"ios-calendar"} size={25} color='springgreen'/>
      <Text style={styles.mediumTextStyle}>{runDate}</Text>
      <Text style={styles.mediumTextStyle}>{runDay}</Text>
    </Card>

    <Card style={{width:'25%'}}>
      <Ionicons name={Platform.OS === 'android'?"md-flame":"ios-flame"} size={25} color='springgreen'/>
      <Text style={styles.mediumTextStyle}>{parseFloat(runCaloriesBurnt).toFixed(2)}</Text>
      <Text style={styles.mediumTextStyle}>Calories</Text>
    </Card>

    <Card style={{width:'33%'}}>
      <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"} size={25} color='springgreen'/>
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
  bgImage: {
   flex: 1
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