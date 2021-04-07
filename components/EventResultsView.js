import React, { useState, useEffect} from 'react';
import { StyleSheet,Text, View,ImageBackground, ScrollView} from 'react-native';
import RoundButton from '../components/RoundButton';
import configData from "../config/config.json";
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import {useSelector} from 'react-redux';

/*
Event Result View, Best Resolution found using 1080*1920 image
*/

const EventResultsView=props=>{

  // State Selectors
  const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);

  //Use Effect Load Time Hook
  useEffect(() => {
    
  }, []);

//View
return(
 	 <View style={styles.eventViewContainerStyle}>
     <View style={styles.imageContainerStyle}>
     <ImageBackground
      source={{uri:configData.SERVER_URL+"event-details/getDisplayImage/"+props.eventId+"?imageType=DISPLAY"}} 
      style={styles.imageStyle}>

      <View style={styles.actionPanelContainerStyle}>

      <View style={styles.buttonContainerStyle}>
       <RoundButton title="Close" style={styles.buttonStyle} onPress={props.onCloseEventResult}/>
      </View>

      </View>
     </ImageBackground>
     </View>
     </View>
 	);
};

const styles = StyleSheet.create({
  eventViewContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainerStyle: {
    flex: 1,
    width: '100%'
  },
  imageStyle: {
    width: '100%',
    height: '100%'
  },

  actionPanelContainerStyle: {
    flex: 0.4,
    top: '60%',
    backgroundColor: 'white',
    borderRadius: 25,
    opacity: 0.7,
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollViewContainerStyle: {
    flex: 1,
    marginTop: '5%'
  },

  buttonContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: '2%',
    borderRadius: 25,
    height: '50%',
    bottom: '2%'
  }
});

export default EventResultsView;