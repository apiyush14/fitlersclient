import React from 'react';
import { StyleSheet, View,FlatList} from 'react-native';
import RunHistoryItem from '../components/RunHistoryItem';

/*
List of Run History Cards
*/
const RunHistoryList=props=>{

const renderRunHistoryItem=itemData=>{
 return <RunHistoryItem
 image={itemData.item.runTrackSnapUrl}
 date={itemData.item.runDate}
 day={itemData.item.runDay}
 lapsedTime={itemData.item.runTotalTime}
 totalDistance={itemData.item.runDistance}
 averagePace={itemData.item.runPace}
 caloriesBurnt={itemData.item.runCaloriesBurnt}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View>
  <FlatList
   ListHeaderComponent={props.header}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderRunHistoryItem} >
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