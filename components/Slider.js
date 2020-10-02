import React, {useState} from 'react';
import { View, StyleSheet, Animated,ImageBackground,Text,Dimensions } from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import RoundButton from '../components/RoundButton';


/*
Swipeable slider button
*/
//https://c0.wallpaperflare.com/preview/929/411/615/athletic-field-ground-lane-lines.jpg

/*
Sample Usage:
<Slider
         buttonTitle='Stop' 
         bounceValue='220' 
         image='uri'/>
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
           <Text style={styles.sliderText}>Slide to Complete Run</Text>
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
    opacity: 1
  },
  bgImage: {
   width: '100%',
   height: '100%',
   overflow: 'hidden',
   borderRadius: 40,
   justifyContent: 'flex-end',
   backgroundColor: 'lightgreen',
   opacity: 1
 },
 sliderText: {
   position: 'absolute',
   marginLeft: 80,
   bottom: '30%',
   color: 'black',
   fontSize: (windowWidth*0.9)/21
 },
  sliderButton: {
     marginLeft: 3,
     width: 70,
     height: 70,
     borderRadius: 70/2,
     borderColor: 'springgreen',
     borderWidth: 2,
     backgroundColor: 'black',
     opacity: 0.9
  }
});

export default Slider;