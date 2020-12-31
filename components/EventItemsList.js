import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import EventItem from '../components/EventItem';
import {useSelector} from 'react-redux';

/*
List Of Event Cards
*/

const EventItemsList=props=>{

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);	

const renderEventItem=itemData=>{
 return <EventItem
 image={"http://192.168.1.66:7001/event-details/getDisplayImage/"+itemData.item.eventId}
 title={itemData.item.eventName}
 eventStartDate={itemData.item.eventStartDate}
 isRegistered={eventRegistrationDetails.findIndex((event)=>event.eventId===itemData.item.eventId)>=0}
 onClickEventItem={()=>{
 	props.onClickEventItem(itemData.item);
 }}/>;
};

return(
<View>
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
screen: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center'
}
});

export default EventItemsList;