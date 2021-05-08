import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import { Ionicons } from '@expo/vector-icons';

/*
Event Result Card Item with shadow effects
*/
const EventResultItem=props=>{

  //State Variables
  const [trackTimer, setTrackTimer] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00"
  });

  const fullName=(props.userFirstName+" "+props.userLastName).substring(0,25);

  //Load Time Use effect hook
  useEffect(() => {
    let secondsVar = ("0" + (Math.floor(props.runTotalTime / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(props.runTotalTime / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(props.runTotalTime / 3600000)).slice(-2);
    setTrackTimer({
      seconds: secondsVar,
      minutes: minutesVar,
      hours: hoursVar
    });
  }, []);

return(
 	<View style={styles.eventResultItemContainerStyle}>

   <View style={styles.eventResultDetailsContainerStyle}>

    <View style={styles.eventResultDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-trophy":"ios-trophy"} size={verticalScale(20)} color='black'/>
     <Text style={styles.eventResultDetailsTextStyle}>{props.userRank}</Text>
    </View>

    <View style={styles.eventResultDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-person":"ios-person"} size={verticalScale(20)} color='black'/>
     <Text style={styles.eventResultDetailsTextStyle}>{fullName}</Text>
    </View>

    <View style={styles.eventResultDetailsRowStyle}>
     <Ionicons name={Platform.OS === 'android'?"md-walk":"ios-walk"} size={verticalScale(20)} color='black'/>
     <Text style={styles.eventResultDetailsTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
    </View>
   </View>
 	</View>
 	);
};


const styles = StyleSheet.create({
  eventResultItemContainerStyle: {
    height: verticalScale(125),
    width: scale(330),
    backgroundColor: 'lightsteelblue',
    borderRadius: 20,
    marginVertical: verticalScale(8),
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center'
  },

  eventResultDetailsContainerStyle: {
    position: "absolute",
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  eventResultDetailsRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%'
  },

  eventResultDetailsTextStyle: {
    fontSize: moderateScale(14, 0.8),
    color: 'black',
    paddingHorizontal: '7%',
    fontFamily: 'open-sans'
  }
});

export default EventResultItem;