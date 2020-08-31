import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions, FlatList,Animated} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import ChallengeList from '../components/ChallengeList';
import RoundButton from '../components/RoundButton';
import {CHALLENGES} from '../data/dummy-data';

import { useSelector, useDispatch } from 'react-redux';

import * as runActions from '../store/run-actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunTrackerHomeScreen = props=>{

const dispatch=useDispatch();

useEffect(()=>{
    dispatch(runActions.loadRuns());
    dispatch(runActions.loadRunSummary());
  }, [dispatch]);

const [location, setLocation] = useState(null);

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

useEffect(()=>{
(async ()=>{
	let {status} = await Location.requestPermissionsAsync();
	if(status!=='granted')
	{
     console.log("Permission Not granted");
	}
	let location = await Location.getCurrentPositionAsync({});
  console.log(location);
	setLocation(location);
})();
},[]);

let mapRegion = {
 latitude: 37.78,
 longitude:  -122.43,
 latitudeDelta: 0.0922,
 longitudeDelta: 0.0421
};

if(location)
{
	mapRegion = {
		latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.000757,
        longitudeDelta: 0.0008
	}
}

	return (
         <View style={styles.mapContainer}>
         <MapView style={styles.map} region={mapRegion}
         pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}>
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
	mapContainer: {
        flex: 1,
		    backgroundColor: 'lightgrey',
        flexDirection: 'column',
	},
	map: {
        height: windowHeight/1.2,
        width: windowWidth,
        borderRadius: 20
	},
	runButton: {
        position: 'absolute',
        top: '75%',
        alignSelf: 'center',
        opacity: 0.7
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