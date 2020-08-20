import React, {useState} from 'react';
import { View, StyleSheet, Button, Animated,ImageBackground,Text } from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import RoundButton from '../components/RoundButton';

//https://c0.wallpaperflare.com/preview/929/411/615/athletic-field-ground-lane-lines.jpg

/*
Sample Usage:
<Slider
         buttonTitle='Stop' 
         bounceValue='220' 
         image='uri'/>
*/

const Slider=props=>{

var isSliderPositionLeft = true;
const [bounceValue, setBounceValue] = useState(new Animated.Value(props.bounceValue));

const toggleSlider=()=>{
     var toValue = props.bounceValue;
     if(isSliderPositionLeft) {
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
isSliderPositionLeft = !isSliderPositionLeft;
};

const sliderAction=()=>{
 props.sliderAction();
};

  return (
         <View style={{...styles.sliderContainer,...props.sliderContainerStyle}}>
         <ImageBackground 
          source={{uri:props.image}} 
           style={{...styles.bgImage,...props.bgImageStyle}}>
           <Animated.View style={[{transform: [{translateX:bounceValue}]}]}>
           <Swipeable renderRightActions={toggleSlider} onSwipeableClose={sliderAction}>
           <RoundButton style={styles.sliderButton} title={props.buttonTitle}>
           </RoundButton>
           </Swipeable>
          </Animated.View>
           </ImageBackground>
         </View>
    );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '80%',
    height: 70,
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 40,
    opacity: 0.5
  },
  bgImage: {
   width: '100%',
   height: '100%',
   overflow: 'hidden',
   borderRadius: 40,
   justifyContent: 'flex-end'
 },
  sliderButton: {
     width: 70,
     height: 70,
     borderRadius: 70/2,
     backgroundColor: 'black',
     opacity: 0.9
  }
});

export default Slider;