import React from 'react';
import { StyleSheet,View,FlatList,ActivityIndicator} from 'react-native';
import RunHistoryItem from '../components/RunHistoryItem';
/*
List of Run History Cards
*/
const RunHistoryList=props=>{

const renderRunHistoryItem=itemData=>{
 return <RunHistoryItem
 runTrackSnapUrl={itemData.item.runTrackSnapUrl}
 runPath={itemData.item.runPath}
 runDate={itemData.item.runDate}
 runDay={itemData.item.runDay}
 runTotalTime={itemData.item.runTotalTime}
 runDistance={itemData.item.runDistance}
 runPace={itemData.item.runPace}
 runCaloriesBurnt={itemData.item.runCaloriesBurnt}
 isSyncDone={itemData.item.isSyncDone}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View style={styles.runHistoryListContainerStyle}>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderRunHistoryItem}
   onEndReachedThreshold={0.5}
   onEndReached={()=>{props.onEndReached()}}
   initialNumToRender={10}>
   </FlatList>
 </View>
 );
};

const styles = StyleSheet.create({
   runHistoryListContainerStyle: {
      flex: 1,
      alignItems: 'center'
   }
});

export default RunHistoryList;