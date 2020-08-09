import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

const TestScreen = props=>{

const [data, setData] = useState({});

  useEffect(() => {
    return () => {
      _toggle();
    };
  }, []);

  const _toggle = () => {
  	  _slow();
      _subscribe();
  };

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _subscribe = () => {
    Accelerometer.addListener(accelerometerData => {
      console.log(accelerometerData);
      setData(accelerometerData);
    });
  };

  let { x, y, z } = data;

	return (
         <View style={styles.mapContainer}>
         <Button title='Stop Run' 
         onPress={()=>{props.navigation.navigate('RunTrackerHome')}}/>
         <Text style={styles.timer}>
        x: {x} y: {y} z: {z}
      </Text>
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
	},
	timer: {
		position: 'absolute',
		top: '15%'
	},
	timerTime: {
		position: 'absolute',
		top: '20%'
	}
});

export default TestScreen;