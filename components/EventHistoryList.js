import React from 'react';
import {StyleSheet,View,FlatList,ActivityIndicator} from 'react-native';
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
 eventId={itemData.item.eventId}
 runTrackSnapUrl={itemData.item.runTrackSnapUrl}
 runPath={itemData.item.runPath}
 runDate={itemData.item.runDate}
 runDay={itemData.item.runDay}
 runTotalTime={itemData.item.runTotalTime}
 runDistance={itemData.item.runDistance}
 runPace={itemData.item.runPace}
 runCaloriesBurnt={itemData.item.runCaloriesBurnt}
 isSyncDone={itemData.item.isSyncDone}
 userRank={eventResult!==undefined?eventResult.userRank:eventResult}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View style={styles.eventHistoryListContainerStyle}>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderEventHistoryItem}
   onEndReachedThreshold={0.5}
   onEndReached={()=>{props.onEndReached()}}
   onRefresh={()=>{props.onRefresh()}}
   refreshing={props.refreshing}
   initialNumToRender={10}>
   </FlatList>
 </View>
 );
};

const styles = StyleSheet.create({
   eventHistoryListContainerStyle: {
      flex: 1,
      alignItems: 'center'
   }
});

export default EventHistoryList;