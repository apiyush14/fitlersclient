import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Animated,ImageBackground } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import {Swipeable} from 'react-native-gesture-handler';
import RoundButton from '../components/RoundButton';
import Slider from '../components/Slider';

const TestScreen = props=>{

return (
         <View style={styles.sliderContainer}>
         <Slider
         buttonTitle='Stop' 
         bounceValue='220' 
         image='https://c0.wallpaperflare.com/preview/929/411/615/athletic-field-ground-lane-lines.jpg'/>
         </View>
    );
};

const styles = StyleSheet.create({
  sliderContainer: {
    top: '80%'
  },
   slider: {
    marginRight: '70%',
    alignSelf: 'center',
    backgroundColor: 'black',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.7,
    justifyContent: 'center'
  },
  bgImage: {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: 40,
  justifyContent: 'flex-end'
 }
});

export default TestScreen;