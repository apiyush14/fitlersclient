import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

const LiveRunTrackerScreen = props=>{

const [location, setLocation] = useState(null);

useEffect(()=>{
(async ()=>{
	let {status} = await Location.requestPermissionsAsync();
	if(status!=='granted')
	{
     console.log("Permission Not granted");
	}
	let location = await Location.getCurrentPositionAsync({});
	setLocation(location);
})();
});

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
         <MapView style={styles.map} region={mapRegion}/>
         </View>
		);
};

const styles = StyleSheet.create({
	mapContainer: {
        flex: 1,
        flexDirection: 'row',
	},
	map: {
		flex: 1
	},
	pace: {
		position: 'absolute'
	}
});

export default LiveRunTrackerScreen;