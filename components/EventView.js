import React, { useState, useEffect} from 'react';
import { StyleSheet,Text, View,ImageBackground, ScrollView} from 'react-native';
import RoundButton from '../components/RoundButton';
import configData from "../config/config.json";
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import {useSelector} from 'react-redux';

/*
Event View, Best Resolution found using 1080*1920 image
*/

const EventView=props=>{

  // State Selectors
  const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  //State Variables
  const [eventStartDay, setEventStartDay] = useState("");
  const [eventStartDate, setEventStartDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState(new Date());
  const [eventMetricValue, setEventMetricValue] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  //Use Effect Load Time Hook
  useEffect(() => {
    var eventStartDate = new Date(props.eventDetails.eventStartDate);
    var eventEndDate = new Date(props.eventDetails.eventEndDate);
    setEventStartDate(eventStartDate);
    setEventEndDate(eventEndDate);
    setEventMetricValue(props.eventDetails.eventMetricValue);
    setIsRegistered(eventRegistrationDetails.findIndex((event)=>event.eventId===props.eventDetails.eventId)>=0);
  }, []);

//View
return(
 	 <View style={styles.eventViewContainerStyle}>
     <View style={styles.imageContainerStyle}>
     <ImageBackground
      source={{uri:configData.SERVER_URL+"event-details/getDisplayImage/"+props.eventDetails.eventId+"?imageType=DISPLAY"}} 
      style={styles.imageStyle}>

      <View style={styles.actionPanelContainerStyle}>
        <ScrollView style={styles.scrollViewContainerStyle}>
         <Text style={styles.eventHeaderTextStyle}>{props.eventDetails.eventName}</Text>
         <Text style={styles.mediumTextStyle}>    Distance {eventMetricValue} KM</Text>

          <View style={styles.eventCalendarContainerStyle}>
           <View style={styles.eventDateContainerStyle}>
            <View style={styles.eventDateDigitViewStyle}>
             <Text style={styles.eventDateTextStyle}>{("0"+parseInt(eventStartDate.getDate())).slice(-2)}</Text>
            </View>
            <View style={styles.eventDateDigitViewStyle}>
             <Text style={styles.eventDateTextStyle}>{("0"+parseInt(eventStartDate.getMonth()+1)).slice(-2)}</Text>
            </View>
            <View style={styles.eventDateDigitViewStyle}>
             <Text style={styles.eventDateTextStyle}>{("0"+parseInt(eventStartDate.getFullYear()%100)).slice(-2)}</Text>
            </View>
           </View>

           <View style={styles.eventDateContainerStyle}>
             <Text style={styles.eventDateFormatTextStyle}>DD</Text>
             <Text style={styles.eventDateFormatTextStyle}>MM</Text>
             <Text style={styles.eventDateFormatTextStyle}>YY</Text>
           </View>
          
            <View style={styles.eventDayContainerStyle}>
             <Text style={styles.mediumTextStyle}>{weekday[eventStartDate.getDay()]}</Text>
            </View>
           
           <View style={styles.eventTimeContainerStyle}>
             <Text style={styles.eventTimeTextStyle}>{("0"+parseInt(eventStartDate.getHours())).slice(-2)}:{("0"+parseInt(eventStartDate.getMinutes())).slice(-2)} - {("0"+parseInt(eventEndDate.getHours())).slice(-2)}:{("0"+parseInt(eventEndDate.getMinutes())).slice(-2)}</Text>
           </View>

          </View>
        </ScrollView>

      <View style={styles.buttonContainerStyle}>
      {!isRegistered?(
       <RoundButton title="Register" style={styles.buttonStyle} onPress={props.onRegisterEventItem}/>)
      :(<View></View>)}
       <RoundButton title="Close" style={styles.buttonStyle} onPress={props.onCloseEventItem}/>
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

  eventCalendarContainerStyle: {
    marginVertical: '5%',
    alignItems: 'center'
  },
  eventMetricValueContainerStyle: {
    flex: 1,
    alignItems: 'center'
  },
  eventDateContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  eventDateDigitViewStyle: {
    marginHorizontal: '1%',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 8
  },
  eventDateTextStyle: {
    fontSize: moderateScale(22, 1),
    color: 'white',
    fontFamily: 'open-sans'
  },

  eventDateFormatTextStyle: {
    fontSize: moderateScale(16, 0.5),
    marginHorizontal: '2%',
    fontFamily: 'open-sans'
  },

  eventDayContainerStyle: {
    flex: 1,
    alignItems: 'center'
  },
  mediumTextStyle: {
    fontSize: moderateScale(16, 0.5),
    fontFamily: 'open-sans',
    alignSelf: 'center'
  },

  eventTimeContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventTimeTextStyle: {
    fontSize: moderateScale(16, 0.5),
    fontFamily: 'open-sans'
  },

  eventHeaderTextStyle: {
    fontSize: moderateScale(20, 0.5),
    alignSelf: 'center',
    fontFamily: 'open-sans'
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

export default EventView;