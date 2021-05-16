import React, { useState, useEffect} from 'react';
import { StyleSheet,Text, View,ImageBackground, ScrollView,ActivityIndicator} from 'react-native';
import RoundButton from '../components/RoundButton';
import configData from "../config/config.json";
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import {useDispatch,useSelector} from 'react-redux';
import EventResultList from '../components/EventResultList';
import * as eventActions from '../store/event-actions';
import StatusCodes from "../utils/StatusCodes.json";

const EventResultsView=props=>{

  const dispatch = useDispatch();

  //State Variables
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreContentAvailableOnServer, setIsMoreContentAvailableOnServer] = useState(true);

  // State Selectors
  const eventResultDetailsForEvent = useSelector(state => state.events.eventResultDetailsForEvent);

  //Use Effect Load Time Hook
  useEffect(() => {
    if (isMoreContentAvailableOnServer) {
      setIsLoading(true);
      let pageNumber = Math.floor(eventResultDetailsForEvent.length / 10);
      dispatch(eventActions.loadEventResultDetailsFromServerBasedOnEventId(props.eventId, pageNumber)).then((response) => {
        if (response.status >= StatusCodes.BAD_REQUEST) {
          setIsMoreContentAvailableOnServer(false);
        } else if (response.data && (!response.data.moreContentAvailable)) {
          setIsMoreContentAvailableOnServer(false);
        } else {
          setIsMoreContentAvailableOnServer(true);
        }
        setIsLoading(false);
      });
    }
  }, []);

    // Event Result Footer for Activity Loader
  const renderEventResultFooter = () => {
    return (
      <View>
    {isLoading?
    (
     <ActivityIndicator size="large" color="green"/>
     ):
    (
     <View></View>
     )
   }
   </View>
    );
  };

//View
return(
 	 <View style={styles.eventResultViewContainerStyle}>
     <View style={styles.imageContainerStyle}>
     <ImageBackground
      source={{uri:configData.SERVER_URL+"event-details/getDisplayImage/"+props.eventId+"?imageType=DISPLAY"}} 
      style={styles.imageStyle}>

      <View style={styles.scrollViewContainerStyle}>

           <EventResultList
            onEndReached={renderEventResultFooter}
            isLoading={isLoading}
            footer={renderEventResultFooter()}
            listData={eventResultDetailsForEvent}/>

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
  eventResultViewContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  imageContainerStyle: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    opacity: 1
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
    height: '40%',
    bottom: 1
  }
});

export default EventResultsView;