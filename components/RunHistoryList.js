import React from 'react';
import { StyleSheet, View,FlatList} from 'react-native';
import RunHistoryItem from '../components/RunHistoryItem';

/*
List of Run History Cards
*/
const RunHistoryList=props=>{

const renderRunHistoryItem=itemData=>{
 return <RunHistoryItem
 image={itemData.item.track_image}
 date={itemData.item.date}
 day={itemData.item.day}
 lapsedTime={itemData.item.lapsedTime}
 totalDistance={itemData.item.totalDistance}
 averagePace={itemData.item.averagePace}
 caloriesBurnt={itemData.item.caloriesBurnt}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View>
  <FlatList
   ListHeaderComponent={props.header}
   data={props.listData}
   keyExtractor={(item,index)=>item.id}
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