import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import ChallengeItem from '../components/ChallengeItem';
import {useSelector} from 'react-redux';
import configData from "../config/config.json";

/*
List Of Challenge Cards
*/

const ChallengeList=props=>{

// State Selectors
const eventRegistrationDetails = useSelector(state => state.events.eventRegistrationDetails);

//Render Challenge Item View
const renderChallengeItem=itemData=>{
 return <ChallengeItem
 image={configData.SERVER_URL+"event-details/getDisplayImage/"+itemData.item.eventId}
 title={itemData.item.eventName}
 eventStartDate={itemData.item.eventStartDate}
 isRegistered={eventRegistrationDetails.findIndex((event)=>event.eventId===itemData.item.eventId)>=0}
 onClickEventItem={()=>{
 	props.onClickEventItem(itemData.item);
 }}/>;
};

//View
return(
<View style={styles.challengeListContainerStyle}>
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
   challengeListContainerStyle: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: '2%'
   }
});

export default ChallengeList;