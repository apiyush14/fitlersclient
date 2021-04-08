import React from 'react';
import {StyleSheet,View,FlatList,ActivityIndicator} from 'react-native';
import EventResultItem from '../components/EventResultItem';
import {useSelector} from 'react-redux';

/*
List of Event Result Cards
*/
const EventResultList=props=>{

// State Selectors
const eventResultDetailsForEvent = useSelector(state => state.events.eventResultDetailsForEvent);

const renderEventResultItem=itemData=>{
 let eventResult=eventResultDetailsForEvent.find(eventResult=>eventResult.userId===itemData.item.userId);
   
 return <EventResultItem
 userId={eventResult.userId}
 userFirstName={eventResult.userFirstName}
 userLastName={eventResult.userLastName}
 userRank={eventResult.userRank}
 runTotalTime={eventResult.runTotalTime}/>;
};

return(
<View style={styles.eventResultListContainerStyle}>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.userId.toString()}
   renderItem={renderEventResultItem}
   onEndReachedThreshold={0.5}
   onEndReached={()=>{props.onEndReached()}}
   initialNumToRender={10}>
   </FlatList>
 </View>
 );
};

const styles = StyleSheet.create({
   eventResultListContainerStyle: {
      flex: 1,
      alignItems: 'center'
   }
});

export default EventResultList;