import React from 'react';
import { StyleSheet, Text, View,Button,FlatList,ScrollView} from 'react-native';
import RunHistoryItem from '../components/RunHistoryItem';

const RunHistoryList=props=>{

console.log(props.listData);

const renderRunHistoryItem=itemData=>{
 return <RunHistoryItem 
 image={itemData.item.track_image}
 date={itemData.item.date}
 day={itemData.item.day}
 lapsedTime={itemData.item.lapsedTime}
 totalDistance={itemData.item.totalDistance}
 onSelectRunItem={()=>{}}/>;
};


return(
<View>
  <FlatList
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