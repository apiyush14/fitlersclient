import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import EventItem from '../components/EventItem';

/*
List Of Event Cards
*/

const EventItemsList=props=>{

const renderEventItem=itemData=>{
 return <EventItem
 image={"http://192.168.1.66:7001/event-details/getDisplayImage/"+itemData.item.eventId}
 title={itemData.item.eventName}
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
   renderItem={renderEventItem} >
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