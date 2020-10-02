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
 runDate={itemData.item.runDate}
 runDay={itemData.item.runDay}
 runTotalTime={itemData.item.runTotalTime}
 runDistance={itemData.item.runDistance}
 runPace={itemData.item.runPace}
 runCaloriesBurnt={itemData.item.runCaloriesBurnt}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderRunHistoryItem}
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

export default RunHistoryList;