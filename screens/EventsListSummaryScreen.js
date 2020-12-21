import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,Modal} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import EventItemsList from '../components/EventItemsList';
import RunHistoryList from '../components/RunHistoryList';
import EventView from '../components/EventView';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EventsListSummaryScreen = props=>{

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);
const eventDetails = useSelector(state => state.events.eventDetails).filter((event)=>eventRegistrationDetails.findIndex(eventState=>eventState.eventId===event.eventId)<0);
const runsHistory = useSelector(state => state.runs.runs).filter((run)=>run.eventId>0);

const [upcomingEventsSelected,setUpcomingEventsSelected]=useState(false);
const [registeredEventsSelected,setRegisteredEventsSelected]=useState(false);
const [completedEventsSelected,setCompletedEventsSelected]=useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [modalEventDetails, setModalEventDetails] = useState(null);

//Load Time useEffect hook
useEffect(() => {
  setUpcomingEventsSelected(true);
      }, []);

const onToggleSelection=(selectedOption)=>{
 if(selectedOption==='upcomingEvents'){
   setRegisteredEventsSelected(false);
   setCompletedEventsSelected(false);
   setUpcomingEventsSelected(true);
 }
 else if(selectedOption==='registeredEvents'){
   setUpcomingEventsSelected(false);
   setCompletedEventsSelected(false);
   setRegisteredEventsSelected(true);
 }
 else if(selectedOption==='completedEvents'){
   setUpcomingEventsSelected(false);
   setRegisteredEventsSelected(false);
   setCompletedEventsSelected(true);
 }
};

    const onClickEventItem = (eventItem) => {
      setModalEventDetails(eventItem);
      setModalVisible(true);
    };

    const onCloseEventItem = (eventItem) => {
      setModalVisible(false);
    };

    const onRegisterEventItem = (eventItem) => {
      dispatch(eventActions.registerUserForEvent(modalEventDetails));
      setModalVisible(false);
    };

return (
  <View style={styles.eventsListSummaryScreenContainer}>
   
   <Modal animationType="slide" transparent={true} visible={modalVisible}
   onRequestClose={()=>{}}>
   <EventView
   onRegisterEventItem={onRegisterEventItem} 
   onCloseEventItem={onCloseEventItem} 
   eventDetails={modalEventDetails}/>
  </Modal>

   <View style={styles.eventsListSummaryScreenHeaderContainer}>
    <TouchableOpacity style={styles.upcomingTouchableStyle} onPress={()=>onToggleSelection('upcomingEvents')}>
     <Text style={{...styles.textHeaderStyle, color:upcomingEventsSelected?'black':'lightgrey'}}>Upcoming</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.registeredTouchableStyle} onPress={()=>onToggleSelection('registeredEvents')}>
     <Text style={{...styles.textHeaderStyle, color:registeredEventsSelected?'black':'lightgrey'}}>Registered</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.completedTouchableStyle} onPress={()=>onToggleSelection('completedEvents')}>
     <Text style={{...styles.textHeaderStyle, color:completedEventsSelected?'black':'lightgrey'}}>Completed</Text>
    </TouchableOpacity>
   </View>

   {completedEventsSelected===false?
   (<View style={styles.eventItemsListStyle}>
    <EventItemsList
    onClickEventItem={onClickEventItem}
    listData={upcomingEventsSelected?eventDetails:eventRegistrationDetails}/>
   </View>):
   (<View style={styles.eventItemsListStyle}>
    <RunHistoryList
   onSelectRunItem={()=>{}}
   onEndReached={()=>{}}
   isLoading={false}
   listData={runsHistory}/>
   </View>)}

  </View>
);
};

const styles = StyleSheet.create({
 eventsListSummaryScreenContainer: {
  flex: 1
 },
 eventsListSummaryScreenHeaderContainer: {
  height: '30%',
  flexDirection: 'row'
 },
  eventItemsListStyle: {
  height: '60%'
 },
 upcomingTouchableStyle: {
  width: '30%',
  top: '20%',
  marginLeft: '2%'
 },
 registeredTouchableStyle:{
  width: '30%',
  top: '20%'
 },
 completedTouchableStyle:{
  width: '30%',
  top: '20%'
 },
 textHeaderStyle: {
  fontSize: 20
 }
});

export default EventsListSummaryScreen;