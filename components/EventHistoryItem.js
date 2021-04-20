import React,{ useState, useEffect } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform, ImageBackground} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import { Ionicons } from '@expo/vector-icons';
import {useSelector} from 'react-redux';

/*
Event History Card Item with shadow effects
*/
const EventHistoryItem = props => {

    //State Variables  
    const [trackTimer, setTrackTimer] = useState({
      seconds: "00",
      minutes: "00",
      hours: "00"
    });
    const [mapRegion, setMapRegion] = useState(null);
    const [runPath, setRunPath] = useState([]);
    const [eventName, setEventName] = useState(null);

    // State Selectors
    const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);

  //UseEffect Load Time Hook
  useEffect(() => {

    setRunPath(props.runPath);

    let secondsVar = ("0" + (Math.floor(props.runTotalTime / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(props.runTotalTime / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(props.runTotalTime / 3600000)).slice(-2);
    setTrackTimer({
      seconds: secondsVar,
      minutes: minutesVar,
      hours: hoursVar
    });

    setMapRegion({
      latitude: props.runPath[Math.floor(props.runPath.length / 2)].latitude,
      longitude: props.runPath[Math.floor(props.runPath.length / 2)].longitude,
      latitudeDelta: Math.abs(props.runPath[props.runPath.length - 1].latitude - props.runPath[0].latitude) + 0.002,
      longitudeDelta: Math.abs(props.runPath[props.runPath.length - 1].longitude - props.runPath[0].longitude) + 0.002
    });

    var index = eventRegistrationDetails.findIndex((event) => event.eventId === props.eventId);
    if (index >= 0) {
      setEventName(eventRegistrationDetails[index].eventName);
    }
  }, []);

//View
return(
 	<View style={styles.runHistoryItemContainerStyle}>
 	 <TouchableOpacity onPress={props.onSelectRunItem}>
 	 
   <View style={styles.mapContainerViewStyle}>
   {runPath&&runPath.length>0?(
   <MapView style={styles.mapContainerStyle} region={mapRegion}
    pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}>
     <Polyline
     strokeWidth={3}
     strokeColor='red'
     coordinates={runPath}/>
     {runPath[0]!==undefined?(
     <Marker pinColor='green' coordinate={runPath[0]}/>):(<View></View>)}
      {runPath[runPath.length-1]!==undefined?(
     <Marker pinColor='red' coordinate={runPath[runPath.length-1]}/>):(<View></View>)}
   </MapView>):
    <View style={styles.mapContainerStyle}>
     <ImageBackground 
      source={require('../assets/images/no_location.jpg')} 
      style={styles.bgImage}>
     </ImageBackground>
    </View>}
   </View>

  <View style={styles.runDetailsContainerStyle}>
   <View style={styles.runDetailsRowStyle}>
    <Ionicons name={Platform.OS === 'android'?"md-trophy":"ios-trophy"} size={24} color='grey'/>
    <Text style={styles.runDetailsTextStyle}>{props.userRank}</Text>
   </View>

   <View style={styles.runDetailsRowStyle}>
    <Ionicons name={Platform.OS === 'android'?"md-walk":"ios-walk"} size={24} color='grey'/>
    <Text style={styles.runDetailsTextStyle}>{parseFloat(props.runDistance/1000).toFixed(2)} KM</Text>
   </View>

   <View style={styles.runDetailsRowStyle}>
    <Ionicons name={Platform.OS === 'android'?"md-stopwatch":"ios-stopwatch"} size={24} color='grey'/>
    <Text style={styles.runDetailsTextStyle}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
   </View>

   <View style={styles.runDetailsRowStyle}>
    <Ionicons name={Platform.OS === 'android'?"md-speedometer":"ios-speedometer"} size={24} color='grey'/>
    <Text style={styles.runDetailsTextStyle}>{parseFloat(props.runPace).toFixed(2)}</Text>
   </View>
  </View>

  {/*
  <View style={styles.runDetailsAdditionalContainerStyle}>
   <View style={styles.runDetailsRowStyle}>
    <Ionicons name={Platform.OS === 'android'?"md-cash":"ios-cash"}  size={24} color='grey'/>
    <Text style={styles.runDetailsTextStyle}>{parseFloat(props.runPace).toFixed(2)}</Text>
   </View>
  </View>*/}

 	<View style={styles.calendarContainerViewStyle}>
 	 <Text style={styles.calendarTextStyle}>{props.runDay}</Text>
 	 <View style={styles.calendarLineStyle}>
 	 </View>
 	 <Text style={styles.calendarTextStyle}>{props.runDate}</Text>
 	</View>

  {eventName!==null?(
  <View style={styles.textViewFooterStyle}>
     <Text style={styles.textStyle}>{eventName}</Text>
  </View>):(<View></View>)}

 	</TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
  runHistoryItemContainerStyle: {
    height: verticalScale(150),
    width: scale(330),
    backgroundColor: 'white',
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
  },

  mapContainerViewStyle: {
    height: '100%',
    width: '30%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapContainerStyle: {
    flex: 1
  },
  bgImage: {
   flex: 1
  },

  runDetailsContainerStyle: {
    position: "absolute",
    flexDirection: 'column',
    alignSelf: 'center',
    width: '40%',
    height: '100%',
    alignItems: 'center'
  },
  runDetailsRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '2%'
  },

  runDetailsAdditionalContainerStyle: {
    width: '30%',
    height: '50%',
    borderRadius: 20,
    position: "absolute",
    alignSelf: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column'
  },

  calendarContainerViewStyle: {
    width: '30%',
    height: '100%',
    borderRadius: 20,
    position: "absolute",
    alignSelf: 'flex-end',
    alignItems: 'center',
    bottom: 0,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  calendarLineStyle: {
    width: '100%',
    borderWidth: 0.4,
    borderColor: 'lightgrey'
  },

  runDetailsTextStyle: {
    fontSize: moderateScale(14, 0.8),
    color: 'black',
    paddingHorizontal: '7%',
    fontFamily: 'open-sans'
  },
  calendarTextStyle: {
    fontSize: moderateScale(12, 0.8),
    color: 'black',
    paddingVertical: '2%',
    alignSelf: 'center',
    fontFamily: 'open-sans'
  },

  textViewFooterStyle: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    alignSelf: 'center',
    bottom: 0
  },
  textStyle: {
    fontSize: moderateScale(10, 0.8),
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: verticalScale(5),
    textAlign: 'center',
    fontFamily: 'open-sans'
  }
});

export default EventHistoryItem;