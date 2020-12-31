import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import ChallengeItem from '../components/ChallengeItem';
import {useSelector} from 'react-redux';

/*
List Of Challenge Cards
*/

const ChallengeList=props=>{

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);

const renderChallengeItem=itemData=>{
 return <ChallengeItem
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
   horizontal={true}
   data={props.listData}
   keyExtractor={(item,index)=>item.eventId.toString()}
   renderItem={renderChallengeItem} 
   onEndReachedThreshold={0}
   onEndReached={()=>{props.onEndReached()}}
   initialNumToRender={10}
   >
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

export default ChallengeList;