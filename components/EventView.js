import React from 'react';
import { StyleSheet,Button ,Text, View, TouchableOpacity,ImageBackground, Dimensions, ScrollView} from 'react-native';
import RoundButton from '../components/RoundButton';

/*
Event View, Best Resolution found using 1080*1920 image
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EventView=props=>{
return(
 	 <View style={styles.eventViewContainer}>
     <View style={styles.imageContainer}>
     <ImageBackground
      source={{uri:"http://192.168.1.66:7001/event-details/getDisplayImage/"+props.eventDetails.eventId}} 
      style={styles.bgImage}>
      <View style={styles.actionPanelContainer}>
        <ScrollView style={styles.scrollViewContainer}>
         <Text style={styles.eventHeader}>{props.eventDetails.eventName}</Text>

          <View style={styles.eventCalendarContainer}>
           <View style={styles.eventDateContainer}>
            <View style={styles.eventDateDigit}>
             <Text style={styles.eventDateStyle}>13</Text>
            </View>
            <View style={styles.eventDateDigit}>
             <Text style={styles.eventDateStyle}>11</Text>
            </View>
            <View style={styles.eventDateDigit}>
             <Text style={styles.eventDateStyle}>20</Text>
            </View>
           </View>

           <View style={styles.eventDateFormatContainer}>
            <View style={styles.eventDateFormat}>
             <Text style={styles.eventDateFormatText}>DD</Text>
            </View>
            <View style={styles.eventDateFormat}>
             <Text style={styles.eventDateFormatText}>MM</Text>
            </View>
            <View style={styles.eventDateFormat}>
             <Text style={styles.eventDateFormatText}>YY</Text>
            </View>
           </View>
          
            <View style={styles.eventDay}>
             <Text style={styles.eventDayText}>Monday</Text>
            </View>
 
           
           <View style={styles.eventTimeContainer}>
            <View style={styles.eventTime}>
             <Text style={styles.eventTimeText}>05:00 AM - 10:00 AM</Text>
            </View>
           </View>

          </View>
        
        </ScrollView>
      <View style={styles.buttonContainer}>
       <RoundButton title="Register" style={styles.registerButton} onPress={props.onRegisterEventItem}/>
       <RoundButton title="Close" style={styles.closeButton} onPress={props.onCloseEventItem}/>
      </View>
      </View>
     </ImageBackground>
     </View>
     </View>
 	);
};


const styles = StyleSheet.create({
	eventViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'white',
    opacity: 1,
    borderRadius: 10
  },
   imageContainer:{
    flex: 1,
    borderRadius: 10,
    width: '100%'
   },
    bgImage: {
     flex: 1,
     position: 'absolute',
     width: '100%',
     height: '100%'
    },
    actionPanelContainer: {
      position: 'absolute',
      top: '60%',
      height: '40%',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 25,
      opacity: 0.7,
      flexDirection: 'column'
    },
    scrollViewContainer: {
      flex: 1,
      width: '100%',
      marginTop: '5%',
      marginLeft: '7%',
      marginRight: '5%',
      alignSelf: 'center'
    },
    eventHeader: {
      fontSize: windowWidth/21,
      alignSelf: 'center'
    },
    eventCalendarContainer: {
      marginTop: '2%',
      marginLeft: '35%'
    },
    eventDateContainer: {
      flexDirection: 'row',
      flex: 1
    },
    eventDateDigit: {
      marginLeft: 1,
      backgroundColor: 'black',
      alignSelf:'center',
      borderRadius: 8
    },
    eventDateStyle: {
      fontSize: windowWidth/12,
      color: 'white'
    },
    eventDateFormatContainer: {
      flexDirection: 'row',
      flex: 1
    },
    eventDateFormat: {
      marginLeft: 5
    },
    eventDateFormatText: {
      fontSize: windowWidth/21
    },
    eventDay: {
      width: 100,
      marginLeft: '8%'
    },
    eventDayText: {
      fontSize: windowWidth/18
    },
    eventTimeContainer: {
      flexDirection: 'row'
    },
    eventTime: {
     
    },
    eventTimeText: {

    },
    
    buttonContainer: {
      width: '100%',
      flexDirection: 'row',
    },
    registerButton: {
        marginLeft: '5%',
        borderRadius: 25,
        width: '45%',
        height: '50%'
    },
    closeButton: {
        borderRadius: 25,
        width: '45%',
        height: '50%'
    }
});

export default EventView;