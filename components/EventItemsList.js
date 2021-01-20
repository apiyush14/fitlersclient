import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import EventItem from '../components/EventItem';
import {useSelector} from 'react-redux';
import configData from "../config/config.json";

/*
List Of Event Cards (Used for Upcoming and Registered Events)
*/

const EventItemsList=props=>{

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);	

const renderEventItem=itemData=>{
 console.log('================Event Item Loaded=======================');
 console.log(itemData.item.eventId);
 console.log(configData.SERVER_URL+"event-details/getDisplayImage/"+itemData.item.eventId+"?imageType=COVER");
 return <EventItem
 image={configData.SERVER_URL+"event-details/getDisplayImage/"+itemData.item.eventId+"?imageType=COVER"}
 title={itemData.item.eventName}
 eventStartDate={itemData.item.eventStartDate}
 isRegistered={eventRegistrationDetails.findIndex((event)=>event.eventId===itemData.item.eventId)>=0}
 onClickEventItem={()=>{
 	props.onClickEventItem(itemData.item);
 }}/>;
};

//View
return(
<View style={styles.eventItemsListContainerStyle}>
  <FlatList
   horizontal={false}
   data={props.listData}
   keyExtractor={(item,index)=>item.eventId.toString()}
   renderItem={renderEventItem} 
   onEndReachedThreshold={0}
   onEndReached={()=>{props.onEndReached()}}
   initialNumToRender={10}>
   </FlatList>
 </View>
 );
};

const styles = StyleSheet.create({
  eventItemsListContainerStyle: {
  	flex: 1,
  	alignItems: 'center'
  }
});

export default EventItemsList;