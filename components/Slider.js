import React, {useState} from 'react';
import { View, StyleSheet, Animated,ImageBackground,Text} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
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

const Slider=props=>{

  var isSliderPositionLeft = true;
  //State Variables
  const [bounceValue, setBounceValue] = useState(new Animated.Value(props.bounceValue));

  const toggleSlider = () => {
    var toValue = props.bounceValue;
    if (isSliderPositionLeft) {
      toValue = 0;
    }
    Animated.spring(
      bounceValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
        useNativeDriver: true
      }
    ).start();
    isSliderPositionLeft = !isSliderPositionLeft;
  };

  const sliderAction = () => {
    props.sliderAction();
  };

  //View
  return (
         <View style={{...styles.sliderContainerStyle,...props.sliderContainerStyle}}>
         <ImageBackground 
          source={{uri:props.image}} 
           style={{...styles.bgImageStyle,...props.bgImageStyle}}>
           <Text style={styles.sliderTextStyle}>Swipe to Complete !!!</Text>
           <Animated.View style={[{transform: [{translateX:bounceValue}]}]}>
           <Swipeable renderRightActions={toggleSlider} onSwipeableClose={sliderAction}>
           <RoundButton style={styles.sliderButtonStyle} title={props.buttonTitle}>
           </RoundButton>
           </Swipeable>
          </Animated.View>
           </ImageBackground>
         </View>
    );
};

const styles = StyleSheet.create({
  sliderContainerStyle: {
    width: '80%',
    height: verticalScale(70),
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 40,
    opacity: 1
  },
  bgImageStyle: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 40,
    justifyContent: 'flex-end',
    backgroundColor: 'darkseagreen',
    opacity: 1
  },
  sliderTextStyle: {
    position: 'absolute',
    bottom: '30%',
    marginLeft: '30%',
    color: 'darkgreen',
    fontSize: scale(15)
  },
  sliderButtonStyle: {
    marginLeft: 3,
    width: verticalScale(70),
    height: verticalScale(70),
    borderRadius: verticalScale(70 / 2),
    borderColor: 'springgreen',
    borderWidth: 2,
    backgroundColor: 'black',
    opacity: 0.9
  }
});

export default Slider;