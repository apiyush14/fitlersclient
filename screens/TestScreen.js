import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Animated,ImageBackground } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import {Swipeable} from 'react-native-gesture-handler';
import RoundButton from '../components/RoundButton';
import Slider from '../components/Slider';
import ChallengeItem from '../components/ChallengeItem';

const TestScreen = props=>{

return (
         <ChallengeItem style={styles.cardItem}
 image='hjk'
 title='test'
 onSelectChallenge={()=>{}}/>
    );
};

const styles = StyleSheet.create({
  cardItem: {
    height: 300,
    width: 150,
    alignSelf: 'center',
    elevation: 4
  }
});

export default TestScreen;