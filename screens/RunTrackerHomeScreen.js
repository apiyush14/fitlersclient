import React, {useState,useEffect} from 'react';
import {View,StyleSheet,Alert,Modal,ImageBackground,Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import RoundButton from '../components/RoundButton';
import {useDispatch,useSelector} from 'react-redux';
import {useIsFocused} from "@react-navigation/native";
import * as runActions from '../store/run-actions';
import * as eventActions from '../store/event-actions';
import * as Permissions from 'expo-permissions';

import ChallengeList from '../components/ChallengeList';
import EventView from '../components/EventView';

const RunTrackerHomeScreen = (props) => {
  console.log('==========RunTrackerHomeScreen===============');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // State Selectors
  const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);
  const eventDetails = useSelector(state => state.events.eventDetails);
  const [isLoading, setIsLoading] = useState(false);


  // State Variables
  const [mapRegion, setMapRegion] = useState({
    latitude: 31,
    longitude: 74,
    latitudeDelta: 0.000757,
    longitudeDelta: 0.0008
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventDetails, setModalEventDetails] = useState(null);
  const [ongoingEventDetails, setOngoingEventDetails] = useState(null);

  //Load Run History Data upon initialization
  useEffect(() => {
    const fetchData = async () => {
      console.log('==========Load Home Screen=============');
      console.log(isFocused);
      if(isFocused){
        console.log('==========Load Home Screen Inside Condition=============');
      dispatch(runActions.loadRuns());
      dispatch(runActions.loadRunSummary());
      dispatch(eventActions.loadEventsFromServer(0));
      dispatch(eventActions.loadEventRegistrationDetails());
      dispatch(eventActions.loadEventResultDetailsFromServer());
    };
  }
    fetchData();
  }, [props, isFocused]);

  //Load Location Details
  useEffect(() => {
    (async () => {
      Location.requestPermissionsAsync().then(response => {
        if (response.status !== 'granted') {
          //TODO : To handle alert to change settings
          Alert.alert("Location Alert", "Location Permission is required!!!");
        } else {
          Location.getCurrentPositionAsync({}).then(response => {
            setMapRegion({
              latitude: response.coords.latitude,
              longitude: response.coords.longitude,
              latitudeDelta: 0.000757,
              longitudeDelta: 0.0008
            });
          });
        }
      });

      Permissions.askAsync(Permissions.MOTION).then(response => {
        //TODO : To handle alert to change settings
        //Motion Sensor Permission Handling
        if (response.status !== 'granted') {
          Alert.alert("Location Alert", "Motion Sensor Permission is required!!!");
        }
      });
    })();
  }, []);
  
  //Use effect for Event Registration Changes
  useEffect(() => {
    (async () => {
      checkAndUpdateOngoingEvent();
    })();
  }, [eventRegistrationDetails]);

  //Method to check if there is an Ongoing Event
  const checkAndUpdateOngoingEvent = () => {
    let currentTime = new Date().getTime();
    if (eventRegistrationDetails !== null && eventRegistrationDetails.length > 0) {
      eventRegistrationDetails.map((event) => {
        var eventStartDateTime = new Date(event.eventStartDate);
        var eventEndDateTime = new Date(event.eventEndDate);
        if (currentTime >= eventStartDateTime.getTime() &&
          currentTime < eventEndDateTime.getTime()) {
          setOngoingEventDetails(event);
        }
      });
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

  //Method to lazy load Events from server 
  const loadMoreDataFromServer = () => {
    setIsLoading(true);
    let pageNumber = Math.floor(eventDetails.length / 3);
    dispatch(eventActions.loadEventsFromServer(pageNumber)).then(() => {
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    });
  };
//Logic to handle shutter tab for challenges

/*
var isHidden = true;
const [bounceValue, setBounceValue] = useState(new Animated.Value(360));

const toggleSubView=()=>{
 var toValue = 360;
 if(isHidden) {
  toValue = 0;
}
Animated.spring(
  bounceValue,
  {
    toValue: toValue,
    velocity: 3,
    tension: 2,
    friction: 8,
    useNativeDriver: true
  }
  ).start();
isHidden = !isHidden;
};*/

//View
return (
  <View style={styles.runTrackerHomeContainerStyle}>
   
  <Modal animationType="slide" transparent={true} visible={modalVisible}
  onRequestClose={()=>{}}>
   <EventView 
   onRegisterEventItem={onRegisterEventItem} 
   onCloseEventItem={onCloseEventItem} 
   eventDetails={modalEventDetails}/>
  </Modal>

  {ongoingEventDetails===null?(
  <MapView style={styles.mapContainerStyle} region={mapRegion}
  pitchEnabled={false} rotateEnabled={false} zoomEnabled={true} scrollEnabled={false}>
  <Marker coordinate={mapRegion}/>
  </MapView>)
  :(
   <View style={styles.mapContainerStyle}>
    <ImageBackground
      source={{uri:"http://192.168.1.66:7001/event-details/getDisplayImage/"+ongoingEventDetails.eventId+"?imageType=DISPLAY"}}
      style={styles.bgImageStyle}>
    </ImageBackground>
   </View>
  )}

  <View style={styles.runButtonStyle}>
   <RoundButton
   title="Run"
   onPress={()=>{props.navigation.navigate('LiveRunTracker',{eventId: ongoingEventDetails!==null?ongoingEventDetails.eventId:0})}}/>
  </View>

  {ongoingEventDetails===null?(
  <View style={styles.challengeListStyle}>
  <ChallengeList 
  listData={eventDetails}
  onEndReached={loadMoreDataFromServer}
  isLoading={isLoading}
  onClickEventItem={onClickEventItem}/>
  </View>):(<View></View>)}

  {/* Commented for now as Challenge is out of scope for now
  <Animated.View style={[styles.subView,{transform: [{translateY:bounceValue}]}]}>
  <Button title="Challenge" onPress={()=>{toggleSubView()}}/>
  <View style={styles.tabListView}>
  <ChallengeList listData={CHALLENGES}/>
  </View>
  </Animated.View>*/}

  </View>
  );
};

const styles = StyleSheet.create({

  runTrackerHomeContainerStyle: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },

  mapContainerStyle: {
    flex: 1,
    borderRadius: 20
  },

  bgImageStyle: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  runButtonStyle: {
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
    opacity: 0.9
  },

  challengeListStyle: {
    position: 'absolute',
    top: '2%'
  },

  /*tabListView: {
    position: 'absolute',
    top: '20%'
  },

  subView: {
    position: "absolute",
    backgroundColor: "white",
    height: 400,
    width: '100%',
    alignSelf: 'center',
    bottom: 0
  }*/
});

export default RunTrackerHomeScreen;