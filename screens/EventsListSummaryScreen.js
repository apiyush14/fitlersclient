import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Modal,ActivityIndicator, Alert} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {useDispatch,useSelector} from 'react-redux';
import EventItemsList from '../components/EventItemsList';
import EventHistoryList from '../components/EventHistoryList';
import EventView from '../components/EventView';
import * as runActions from '../store/run-actions';
import * as eventActions from '../store/event-actions';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import StatusCodes from "../utils/StatusCodes.json";
import RunDetails from '../models/rundetails';

const EventsListSummaryScreen = props => {

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // State Selectors
  const eventDetails = useSelector(state => state.events.eventDetails);
  const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails).filter((event) => {
    let currentTime = new Date().getTime();
    var eventEndDateTime = new Date(event.eventEndDate);
    return currentTime <= eventEndDateTime.getTime() && event.runId === 0;
  });
  const runsHistoryDetails = useSelector(state => state.runs.runs);
  const eventRunsHistoryDetails = useSelector(state => state.runs.runs).filter((run) => run.eventId > 0);
  const eventResultDetails = useSelector(state => state.events.eventResultDetails);

  //State Variables
  const [upcomingEventsSelected, setUpcomingEventsSelected] = useState(false);
  const [registeredEventsSelected, setRegisteredEventsSelected] = useState(false);
  const [completedEventsSelected, setCompletedEventsSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventDetails, setModalEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreContentAvailableOnServer, setIsMoreContentAvailableOnServer] = useState(true);
  const [isMoreContentAvailableOnServerForEventResults, setIsMoreContentAvailableOnServerForEventResults] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //Load Time useEffect hook
  useEffect(() => {
    setUpcomingEventsSelected(true);
  }, []);

  // Use Effect Hook to be loaded everytime the screen loads
  useEffect(() => {
    if (isFocused) {
      setIsMoreContentAvailableOnServer(true);
      setIsMoreContentAvailableOnServerForEventResults(true);
    }
  }, [props, isFocused]);

  //Toggle Events Option
  const onToggleSelection = (selectedOption) => {
    if (selectedOption === 'upcomingEvents') {
      setIsMoreContentAvailableOnServer(true);
      setRegisteredEventsSelected(false);
      setCompletedEventsSelected(false);
      setUpcomingEventsSelected(true);
    } else if (selectedOption === 'registeredEvents') {
      setIsMoreContentAvailableOnServer(true);
      setUpcomingEventsSelected(false);
      setCompletedEventsSelected(false);
      setRegisteredEventsSelected(true);
    } else if (selectedOption === 'completedEvents') {
      setIsMoreContentAvailableOnServer(true);
      setIsMoreContentAvailableOnServerForEventResults(true);
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
    dispatch(eventActions.registerUserForEvent(modalEventDetails)).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      } else
      if (response.status != StatusCodes.OK) {
        Alert.alert("Registration Failed", "Registration for the event failed, please try again later!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      } else {
        Alert.alert("Registration Successful", "You have been registered successfully, see you on Run Day!!!", [{
          text: 'OK',
          onPress: () => {
            setModalVisible(false)
          }
        }], {
          cancelable: false
        });
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(eventActions.loadEventResultDetailsFromServer(0)).then((response) => {
      setRefreshing(false);
    });
  };

  //Method to lazy load Event Results from server 
  const loadMoreEventResultsFromServer = () => {
    
    //TO BE OPTIMIZED BY CALLING SERVICE TO GET RUN DETAILS BASED ON RUN ID
    if (isMoreContentAvailableOnServer && runsHistoryDetails.length<30) {
      setIsLoading(true);
      let pageNumber = Math.floor(runsHistoryDetails.length / 10);

      dispatch(runActions.loadRunsFromServer(false, pageNumber)).then((response) => {
        if (response.status >= StatusCodes.BAD_REQUEST) {
          setIsMoreContentAvailableOnServer(false);
        } else if (response.data && (!isMoreContentAvailableOnServerForEventResults) && (eventRunsHistoryDetails.length >= eventResultDetails.length)) {
          setIsMoreContentAvailableOnServer(false);
        }
        setIsLoading(false);
      });
    }
    if (isMoreContentAvailableOnServerForEventResults) {
      setIsLoading(true);
      let pageNumber = Math.floor(eventRunsHistoryDetails.length / 10);

      dispatch(eventActions.loadEventResultDetailsFromServer(pageNumber)).then((response) => {
        if (response.status >= StatusCodes.BAD_REQUEST) {
          setIsMoreContentAvailableOnServerForEventResults(false);
        } else if (response.data && (!response.data.moreContentAvailable)) {
          setIsMoreContentAvailableOnServerForEventResults(false);
          if(eventRunsHistoryDetails.length >= eventResultDetails.length){
            setIsMoreContentAvailableOnServer(false);
          }
        } else {
          setIsMoreContentAvailableOnServerForEventResults(true);
        }
        setIsLoading(false);
      });
    }
  };

  //Method to lazy load Upcoming Events from server 
  const loadMoreEventsFromServer = () => {
    if (isMoreContentAvailableOnServer) {
      setIsLoading(true);
      let pageNumber = Math.floor(eventDetails.length / 10);
      dispatch(eventActions.loadEventsFromServer(pageNumber)).then((response) => {
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
  };

  //Method to lazy load Registration Details from server 
  const loadMoreEventRegistrationDetailsFromServer = () => {
    if (isMoreContentAvailableOnServer) {
      setIsLoading(true);
      let pageNumber = Math.floor(eventRegistrationDetails.length / 10);
      dispatch(eventActions.loadEventRegistrationDetailsFromServer(pageNumber)).then((response) => {
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
  };

  //Event Listener to be called on selecting Run and to navigate to Run History Screen
  const onSelectRunHistoryItem = (itemdata) => {
    var runDetails = new RunDetails(itemdata.item.runId, itemdata.item.runTotalTime, itemdata.item.runDistance, itemdata.item.runPace, itemdata.item.runCaloriesBurnt, 0, itemdata.item.runStartDateTime, itemdata.item.runDate, itemdata.item.runDay, itemdata.item.runPath, itemdata.item.runTrackSnapUrl, itemdata.item.eventId, "1");
    props.navigation.navigate('Run Details', {
      sourceScreen: 'RunHistoryScreen',
      runDetails: runDetails
    });
  };

  // Event Summary Footer for Activity Loader
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

//View
return (
  <View style={styles.eventsListSummaryScreenContainerStyle}>
   
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

   {completedEventsSelected&&eventRunsHistoryDetails.length>0?(
   <View style={styles.headerTextViewStyle}>
     <Text style={styles.textHeaderStyle}>Pull to Refresh Rank</Text>
   </View>):
   (<View></View>)}

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
    footer={renderEventSummaryFooter()}
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
    onEndReached={loadMoreEventRegistrationDetailsFromServer}
    isLoading={isLoading}
    footer={renderEventSummaryFooter()}
    listData={eventRegistrationDetails}/>
   </View>):
   
   eventRunsHistoryDetails.length===0?
   (<View style={styles.eventItemsListStyle}>
     <Text style={styles.defaultTextStyle}>No Completed Events</Text>
    </View>):
   (<View style={styles.eventItemsListStyle}>
    <EventHistoryList
   onSelectRunItem={onSelectRunHistoryItem}
   onEndReached={loadMoreEventResultsFromServer}
   isLoading={isLoading}
   onRefresh={onRefresh}
   refreshing={refreshing}
   footer={renderEventSummaryFooter()}
   listData={eventRunsHistoryDetails}/>
   </View>)}

  </View>
);
};

const styles = StyleSheet.create({
  eventsListSummaryScreenContainerStyle: {
    flex: 1
  },
  eventsListSummaryScreenHeaderOptionsStyle: {
    height: '20%',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  eventItemsListStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  touchableOptionStyle: {
    width: '30%',
    height: '20%',
    top: '10%',
    borderRightWidth: 1,
    borderColor: 'lightgrey'
  },
  headerTextViewStyle: {
    alignItems: 'center',
    backgroundColor: 'white'
  },
  textHeaderStyle: {
    fontSize: moderateScale(15, 0.5),
    alignSelf: 'center',
    fontFamily: 'open-sans'
  },
  defaultTextStyle: {
    fontSize: moderateScale(15, 0.5),
    alignSelf: 'center',
    top: '50%',
    color: 'grey',
    fontFamily: 'open-sans'
  }
});

export default EventsListSummaryScreen;