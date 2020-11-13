import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import ChallengeItem from '../components/ChallengeItem';

/*
List Of Challenge Cards
*/

const ChallengeList=props=>{

const renderChallengeItem=itemData=>{
 return <ChallengeItem
 image={"http://192.168.1.66:7001/event-details/getDisplayImage/"+itemData.item.eventId}
 title={itemData.item.eventName}
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
   renderItem={renderChallengeItem} >
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