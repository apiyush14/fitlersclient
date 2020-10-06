import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Dimensions,Animated,Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import RoundButton from '../components/RoundButton';
import {useDispatch} from 'react-redux';
import * as runActions from '../store/run-actions';
import * as Permissions from 'expo-permissions';

import ChallengeList from '../components/ChallengeList';
import {CHALLENGES} from '../data/dummy-data';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunTrackerHomeScreen = (props)=>{

  const dispatch=useDispatch();

// State Variables
  const [mapRegion, setMapRegion] = useState({
    latitude: 31,
    longitude: 74,
    latitudeDelta: 0.000757,
    longitudeDelta: 0.0008
  });

//Load Run History Data upon initialization
useEffect(()=>{
  const fetchData=async ()=>{
    dispatch(runActions.loadRuns());
    dispatch(runActions.loadRunSummary());
  };
  fetchData();
}, []);

//Load Location Details
useEffect(()=>{
  (async ()=>{

    let {status} = await Location.requestPermissionsAsync();
    let statusMotion = await Permissions.askAsync(Permissions.MOTION);
  
  //TODO : To handle alert to change settings
  //Motion Sensor Permission Handling
  if(statusMotion.status!=='granted'){
   Alert.alert("Location Alert","Motion Sensor Permission is required!!!");
   console.log("Permission Not granted");
 }

  //Location Sensor Permission Handling
  if(status!=='granted')
  {
     //TODO : To handle alert to change settings
     Alert.alert("Location Alert","Location Permission is required!!!");
     console.log("Permission Not granted");
   }
   else{
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.000757,
      longitudeDelta: 0.0008
    });
  }
})();
},[]);

//Logic to handle shutter tab for challenges
var isHidden = true;
const [bounceValue, setBounceValue] = useState(new Animated.Value(360));

const toggleSubView=()=>{
 var toValue = 360;
 if(isHidden) {
  toValue = 0;
}
Animated.spring(
  bounceValue,
  {
    toValue: toValue,
    velocity: 3,
    tension: 2,
    friction: 8,
    useNativeDriver: true
  }
  ).start();
isHidden = !isHidden;
};

return (
  <View style={styles.runTrackerHomeContainer}>

  <MapView style={styles.mapContainer} region={mapRegion}
  pitchEnabled={false} rotateEnabled={false} zoomEnabled={true} scrollEnabled={false}>
  <Marker coordinate={mapRegion}/>
  </MapView>

  <View style={styles.runButton}>
  <RoundButton
  title="Run"
  onPress={()=>{props.navigation.navigate('LiveRunTracker')}}/>
  </View>

  <View style={styles.challengeList}>
  <ChallengeList listData={CHALLENGES}/>
  </View>

  <Animated.View style={[styles.subView,{transform: [{translateY:bounceValue}]}]}>
  <Button title="Challenge" onPress={()=>{toggleSubView()}}/>
  <View style={styles.tabListView}>
  <ChallengeList listData={CHALLENGES}/>
  </View>
  </Animated.View>

  </View>
  );
};

const styles = StyleSheet.create({

	runTrackerHomeContainer: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },

  mapContainer: {
    height: '90%',
    width: '100%',
    borderRadius: 20
  },

  runButton: {
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
    opacity: 0.9
  },

  challengeList: {
    position: 'absolute',
    top: '2%'
  },

  tabListView: {
    position: 'absolute',
    top: '20%'
  },

  subView: {
    position: "absolute",
    backgroundColor: "white",
    height: 400,
    width: '100%',
    alignSelf: 'center',
    bottom: 0
  }
});

export default RunTrackerHomeScreen;