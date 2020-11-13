import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Animated,ImageBackground } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import {Swipeable} from 'react-native-gesture-handler';
import RoundButton from '../components/RoundButton';
import Slider from '../components/Slider';
import EventView from '../components/EventView';

const TestScreen = props=>{

return (
   <View style={styles.containerView1}>
    <EventView />
   </View>
    );
};

const styles = StyleSheet.create({
	containerView1: {
      alignItems: 'center',
      backgroundColor: 'white'
	},
	    containerView:{
        width: 130,
        height: 130,
        borderRadius: (330+12)/5,
        borderColor: 'springgreen',
        borderWidth: 2,
        alignSelf: 'center',
        top: 5
	},
 circleDashboardBorder: {
        width: (330+12)/2.5,
        height: (330+12)/2.5,
        borderRadius: (330+12)/5,
        shadowColor: "springgreen",
        shadowOffset: {
      	width: 0,
	    height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
});

export default TestScreen;