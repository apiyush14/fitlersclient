import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Modal,ActivityIndicator} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import EventItemsList from '../components/EventItemsList';
import EventHistoryList from '../components/EventHistoryList';
import EventView from '../components/EventView';
import { Ionicons } from '@expo/vector-icons';
import * as runActions from '../store/run-actions';
import * as eventActions from '../store/event-actions';
import { scale, moderateScale, verticalScale} from '../utils/Utils';

const EventsListSummaryScreen = props=>{

const dispatch = useDispatch();

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails).filter((event)=>{
       let currentDate=new Date();
       let eventStartDate=new Date(event.eventStartDate);
       let numberOfDaysLeft=Math.floor((currentDate.getTime()-eventStartDate.getTime())/(1000*3600*24));
       return numberOfDaysLeft<=0;
});
const eventDetails = useSelector(state => state.events.eventDetails);
const runsHistoryDetails = useSelector(state => state.runs.runs);
const runsHistory = useSelector(state => state.runs.runs).filter((run)=>run.eventId>0);

const [upcomingEventsSelected,setUpcomingEventsSelected]=useState(false);
const [registeredEventsSelected,setRegisteredEventsSelected]=useState(false);
const [completedEventsSelected,setCompletedEventsSelected]=useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [modalEventDetails, setModalEventDetails] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [refreshing,setRefreshing]=useState(false);

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

    const onRefresh=()=>{
     setRefreshing(true);
     dispatch(eventActions.loadEventResultDetailsFromServer()).then(() => {
      setRefreshing(false);
    }).catch(err => {
      setRefreshing(false);
    });
    };

 //Method to lazy load Runs from server 
  const loadMoreRunsHistoryFromServer = () => {
    setIsLoading(true);
    let pageNumber = Math.floor(runsHistoryDetails.length / 3);
    dispatch(runActions.loadRunsFromServer(pageNumber)).then(() => {
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    });
  };

  //Method to lazy load Events from server 
  const loadMoreEventsFromServer = () => {
    setIsLoading(true);
    let pageNumber = Math.floor(eventDetails.length / 3);
    dispatch(eventActions.loadEventsFromServer(pageNumber)).then(() => {
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    });
  };

  //Event Listener to be called on selecting Run and to navigate to Run History Screen
  const onSelectRunHistoryItem = (itemdata) => {
    props.navigation.navigate('RunDetailsScreen', {
      runId: itemdata.item.runId,
      eventId: itemdata.item.eventId,
      runTrackSnapUrl: itemdata.item.runTrackSnapUrl,
      runDate: itemdata.item.runDate,
      runDay: itemdata.item.runDay,
      runTotalTime: itemdata.item.runTotalTime,
      runDistance: itemdata.item.runDistance,
      runPace: itemdata.item.runPace,
      runCaloriesBurnt: itemdata.item.runCaloriesBurnt,
      runPath: itemdata.item.runPath,
      sourceScreen: 'RunHistoryScreen'
    });
  };   

  // Event History Footer for Activity Loader
  const renderEventSummaryFooter = () => {
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

return (
  <View style={styles.eventsListSummaryScreenContainer}>
   
   <Modal animationType="slide" transparent={true} visible={modalVisible}
   onRequestClose={()=>{}}>
   <EventView
   onRegisterEventItem={onRegisterEventItem} 
   onCloseEventItem={onCloseEventItem} 
   eventDetails={modalEventDetails}/>
  </Modal>

   <View style={styles.eventsListSummaryScreenHeaderOptionsStyle}>
    <TouchableOpacity style={styles.touchableOptionStyle} onPress={()=>onToggleSelection('upcomingEvents')}>
     <Text style={{...styles.textHeaderStyle, color:upcomingEventsSelected?'black':'lightgrey'}}>Upcoming</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableOptionStyle} onPress={()=>onToggleSelection('registeredEvents')}>
     <Text style={{...styles.textHeaderStyle, color:registeredEventsSelected?'black':'lightgrey'}}>Registered</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableOptionStyle} onPress={()=>onToggleSelection('completedEvents')}>
     <Text style={{...styles.textHeaderStyle, color:completedEventsSelected?'black':'lightgrey'}}>Completed</Text>
    </TouchableOpacity>
   </View>

   {upcomingEventsSelected===true?
   eventDetails.length===0?
   (<View style={styles.eventItemsListStyle}>
     <Text style={styles.defaultTextStyle}>No Upcoming Events</Text>
    </View>):
   (<View style={styles.eventItemsListStyle}>
    <EventItemsList
    onClickEventItem={onClickEventItem}
    onEndReached={loadMoreEventsFromServer}
    isLoading={isLoading}
    listData={eventDetails}/>
   </View>):

   registeredEventsSelected===true?
   eventRegistrationDetails.length===0?
   (<View style={styles.eventItemsListStyle}>
     <Text style={styles.defaultTextStyle}>No Registered Events</Text>
    </View>):
   (<View style={styles.eventItemsListStyle}>
    <EventItemsList
    onClickEventItem={onClickEventItem}
    onEndReached={loadMoreEventsFromServer}
    isLoading={isLoading}
    listData={eventRegistrationDetails}/>
   </View>):
   
   runsHistory.length===0?
   (<View style={styles.eventItemsListStyle}>
     <Text style={styles.defaultTextStyle}>No Completed Events</Text>
    </View>):
   (<View style={styles.eventItemsListStyle}>
    <EventHistoryList
   onSelectRunItem={onSelectRunHistoryItem}
   onEndReached={loadMoreRunsHistoryFromServer}
   isLoading={isLoading}
   onRefresh={onRefresh}
   refreshing={refreshing}
   footer={renderEventSummaryFooter()}
   listData={runsHistory}/>
   </View>)}

  </View>
);
};

const styles = StyleSheet.create({
 eventsListSummaryScreenContainer: {
  flex: 1
 },
 eventsListSummaryScreenHeaderOptionsStyle: {
  height: '20%',
  backgroundColor: 'white',
  flexDirection: 'row'
 },
  eventItemsListStyle: {
  height: '80%',
  backgroundColor: 'white'
 },
 touchableOptionStyle: {
  width: '30%',
  height: '20%',
  top: '10%',
  borderRightWidth: 1,
  borderColor: 'lightgrey'
 },
 textHeaderStyle: {
  fontSize: moderateScale(15,0.9),
  alignSelf: 'center'
 },
 defaultTextStyle: {
  fontSize: moderateScale(15,0.9),
  alignSelf: 'center',
  top: '50%',
  color: 'grey'
 }
});

export default EventsListSummaryScreen;