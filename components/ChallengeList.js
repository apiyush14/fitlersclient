import React from 'react';
import { StyleSheet, Text, View,FlatList} from 'react-native';
import ChallengeItem from '../components/ChallengeItem';

/*
List Of Challenge Cards
*/

const ChallengeList=props=>{

const renderChallengeItem=itemData=>{
 return <ChallengeItem 
 image={itemData.item.imageUrl}
 title={itemData.item.title}
 onSelectChallenge={()=>{}}/>;
};

return(
<View>
  <FlatList
   horizontal={true}
   data={props.listData}
   keyExtractor={(item,index)=>item.id}
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