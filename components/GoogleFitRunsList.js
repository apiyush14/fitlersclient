import React from 'react';
import { StyleSheet,View,FlatList,ActivityIndicator} from 'react-native';
import GoogleFitRunItem from '../components/GoogleFitRunItem';
/*
List of Google Fit Runs History Cards
*/
const GoogleFitRunsList=props=>{

const renderGoogleFitRunItem=itemData=>{
 return <GoogleFitRunItem
 runTrackSnapUrl={itemData.item.runTrackSnapUrl}
 runPath={itemData.item.runPath}
 runDate={itemData.item.runDate}
 runDay={itemData.item.runDay}
 runTotalTime={itemData.item.runTotalTime}
 runDistance={itemData.item.runDistance}
 runPace={itemData.item.runPace}
 runCaloriesBurnt={itemData.item.runCaloriesBurnt}
 isSyncDone={itemData.item.isSyncDone}
 runStartTime={itemData.item.runId}
 runEndTime={itemData.item.runId+itemData.item.runTotalTime}
 onSelectRunItem={()=>{props.onSelectRunItem(itemData)}}/>;
};

return(
<View style={styles.googleFitRunsListContainerStyle}>
  <FlatList
   ListHeaderComponent={props.header}
   ListFooterComponent={props.footer}
   data={props.listData}
   keyExtractor={(item,index)=>item.runId.toString()}
   renderItem={renderGoogleFitRunItem}
   onEndReachedThreshold={0.5}
   onEndReached={()=>{props.onEndReached()}}
   initialNumToRender={10}>
   </FlatList>
 </View>
 );
};

const styles = StyleSheet.create({
   googleFitRunsListContainerStyle: {
      flex: 1,
      alignItems: 'center'
   }
});

export default GoogleFitRunsList;