import React,{useState} from 'react';
import { StyleSheet,View,FlatList,ActivityIndicator} from 'react-native';
import EventHistoryItem from '../components/EventHistoryItem';
import {useSelector} from 'react-redux';
/*
List of Event History Cards
*/
const EventHistoryList=props=>{

// State Selectors
const eventResultDetails = useSelector(state => state.events.eventResultDetails);

const renderEventHistoryItem=itemData=>{   
 let eventResult=eventResultDetails.find(eventResult=>eventResult.runId===itemData.item.runId);
   
 return <EventHistoryItem
 runTrackSnapUrl={itemData.item.runTrackSnapUrl}
 runDate={itemData.item.runDate}
 runDay={itemData.item.runDay}
 runTotalTime={itemData.item.runTotalTime}
 runDistance={itemData.item.runDistance}
 runPace={itemData.item.runPace}
 runCaloriesBurnt={itemData.item.runCaloriesBurnt}
 userRank={eventResult!==undefined?eventResult.userRank:eventResult}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderEventHistoryItem}
   onEndReachedThreshold={0}
   onEndReached={()=>{props.onEndReached()}}
   onRefresh={()=>{props.onRefresh()}}
   refreshing={props.refreshing}
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

export default EventHistoryList;