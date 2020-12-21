import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Dimensions,
  Animated,
  Alert,
  Modal,
  ImageBackground,
  Text
} from 'react-native';
import MapView, {
  Marker
} from 'react-native-maps';
import * as Location from 'expo-location';
import RoundButton from '../components/RoundButton';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import * as runActions from '../store/run-actions';
import * as eventActions from '../store/event-actions';
import * as Permissions from 'expo-permissions';
import {
  AsyncStorage
} from 'react-native';

import ChallengeList from '../components/ChallengeList';
import EventView from '../components/EventView';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunTrackerHomeScreen = (props) => {

    const dispatch = useDispatch();

    // State Selectors
    const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);
    const eventDetails = useSelector(state => state.events.eventDetails).filter((event)=>eventRegistrationDetails.findIndex(eventState=>eventState.eventId===event.eventId)<0);


    // State Variables
    const [mapRegion, setMapRegion] = useState({
      latitude: 31,
      longitude: 74,
      latitudeDelta: 0.000757,
      longitudeDelta: 0.0008
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEventDetails, setModalEventDetails] = useState(null);
    const [ongoingEventDetails,setOngoingEventDetails]=useState(null);

    //Load Run History Data upon initialization
    useEffect(() => {
      const fetchData = async () => {
        dispatch(runActions.loadRuns());
        dispatch(runActions.loadRunSummary());
        dispatch(eventActions.loadEventsFromServer());
        dispatch(eventActions.loadEventRegistrationDetails());
      };
      fetchData();
    }, []);

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

    useEffect(() => {
      (async () => {
       checkAndUpdateOngoingEvent();
      })();
    }, [eventRegistrationDetails]);

    const checkAndUpdateOngoingEvent=()=>{
      let currentTime=new Date().getTime();
      if(eventRegistrationDetails!==null&&eventRegistrationDetails.length>0){
           eventRegistrationDetails.map((event)=>{
              var eventStartDateTime=new Date(event.eventStartDate);
              var eventEndDateTime=new Date(event.eventEndDate);
              if(currentTime>=eventStartDateTime.getTime()
                &&currentTime<eventEndDateTime.getTime()){
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

return (
  <View style={styles.runTrackerHomeContainer}>
   
  <Modal animationType="slide" transparent={true} visible={modalVisible}
  onRequestClose={()=>{}}>
   <EventView 
   onRegisterEventItem={onRegisterEventItem} 
   onCloseEventItem={onCloseEventItem} 
   eventDetails={modalEventDetails}/>
  </Modal>

  {ongoingEventDetails===null?(
  <MapView style={styles.mapContainer} region={mapRegion}
  pitchEnabled={false} rotateEnabled={false} zoomEnabled={true} scrollEnabled={false}>
  <Marker coordinate={mapRegion}/>
  </MapView>)
  :(
   <View style={styles.mapContainer}>
    <ImageBackground
      source={{uri:"http://192.168.1.66:7001/event-details/getDisplayImage/"+ongoingEventDetails.eventId}}
      style={styles.bgImage}>
    </ImageBackground>
   </View>
  )}

  <View style={styles.runButton}>
  <RoundButton
  title="Run"
  onPress={()=>{props.navigation.navigate('LiveRunTracker',{eventId: ongoingEventDetails!==null?ongoingEventDetails.eventId:0})}}/>
  </View>

  <View style={styles.challengeList}>
  <ChallengeList listData={eventDetails} onClickEventItem={onClickEventItem}/>
  </View>

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

	runTrackerHomeContainer: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },

  mapContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 20
  },

  bgImage: {
     flex: 1,
     position: 'absolute',
     width: '100%',
     height: '100%'
    },

  runButton: {
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
    opacity: 0.9
  },

  challengeList: {
    position: 'absolute',
    top: '2%'
  },

  tabListView: {
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
  }
});

export default RunTrackerHomeScreen;