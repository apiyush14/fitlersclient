import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet,Animated, TouchableOpacity, Button, Dimensions} from 'react-native';
import RunHistoryList from '../components/RunHistoryList';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import * as runActions from '../store/run-actions';

import DashboardItem from '../components/DashboardItem';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunHistoryScreen = props=>{

/*const unsubscribe = props.navigation.addListener('didFocus', () => {
    toggleCircle();
});*/

const runsHistory = useSelector(state => state.runs.runs);
const runSummary=useSelector(state => state.runs.runSummary);
const dispatch=useDispatch();

/*useEffect(()=>{
    dispatch(runActions.loadRuns());
    dispatch(runActions.loadRunSummary());
  }, [dispatch]);
*/

/*var isSliderPositionLeft = true;
const [bounceValue, setBounceValue] = useState(new Animated.Value(0));*/

/*const toggleCircle=()=>{
      var toValue = props.bounceValue;
      if(isSliderPositionLeft) {
      toValue = 45;
    }
Animated.timing(
      bounceValue,
      {
        toValue: toValue,
        duration: 2000,
        useNativeDriver: true
      }
    ).start();
isSliderPositionLeft = !isSliderPositionLeft;
};*/

const onSelectRunHistoryItem=(itemdata)=>{
    props.navigation.navigate('RunDetailsScreen', {
    track_image:itemdata.item.track_image,
    date:itemdata.item.date,
    day:itemdata.item.day,
    lapsedTime:itemdata.item.lapsedTime,
    totalDistance:itemdata.item.totalDistance,
    averagePace:itemdata.item.averagePace,
    caloriesBurnt: itemdata.item.caloriesBurnt,
    path: itemdata.item.path,
    sourceScreen: 'RunHistoryScreen' 
    });
};

const renderRunSummaryHeader=()=>{
 return (
          <View style={styles.runsHistoryDetailsPanel}>
          <DashboardItem
          text={runSummary!=null?parseFloat(runSummary.totalDistance/1000).toFixed(2)+" KM":0+" KM"}
          footerText="Total Distance"
          style={styles.totalDistanceDashboardItem} 
          icon="ios-walk"/>
          <DashboardItem 
          text={runSummary!=null?parseFloat(runSummary.averageDistance/1000).toFixed(2)+" KM":0+" KM"}
          footerText="Average Distance"
          style={styles.averageDistanceDashboardItem} 
          icon="ios-stats"/>
          <DashboardItem 
          text={runSummary!=null?parseFloat(runSummary.averagePace).toFixed(2):0.00}
          footerText="Average Pace"
          style={styles.averagePaceDashboardItem} 
          icon="ios-stopwatch"/>

          <View style={styles.footerContainer}>
           <View style={styles.footer1}>
             <View style={styles.footer1ValueContainer}> 
              <Ionicons name="ios-ribbon" size={30} color='springgreen'/>
              <Text style={styles.footer1Value}> {runSummary!=null?parseInt(runSummary.totalRuns):0}</Text>
             </View>
            <Text style={styles.footer1Text}>Total Runs</Text>
           </View>
           <View style={styles.footer2}>
              <View style={styles.footer2ValueContainer}>
               <Ionicons name="ios-flame" size={30} color='springgreen'/>
               <Text style={styles.footer2Value}> 0</Text> 
             </View>
             <Text style={styles.footer2Text}>Calories</Text>
           </View>
          </View>
         </View>
         );
     };

return (
         <View style={styles.runHistoryContainer}>
         <View style={styles.runsScrollPanel}>
         <RunHistoryList
         onSelectRunItem={onSelectRunHistoryItem}
         header={renderRunSummaryHeader()}
         listData={runsHistory}/>
         </View>
         </View>
		);
};

const styles = StyleSheet.create({
    runHistoryContainer: {
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'column'
    },
    runsHistoryDetailsPanel: {
        paddingVertical: '20%',
        backgroundColor: '#303030'
    },
    runsScrollPanel: {
        flex:1
    },
    totalDistanceDashboardItem: {
       alignSelf: 'center',
       top: '25%'
    },
    averagePaceDashboardItem: {
        position: 'absolute',
        top: '10%',
        alignSelf: 'flex-start'
    },
    averageDistanceDashboardItem: {
        position: 'absolute',
        top: '10%',
        alignSelf: 'flex-end'
    },
    footerContainer: {
        flex: 1,
        top: '20%',
        height: 70,
        borderColor: 'grey',
        borderWidth: 1,
        flexDirection: 'row'
    },
    footer1ValueContainer: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    footer2ValueContainer: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    footer1: {
        flex: 1,
        width: '50%',
        borderRightWidth: 1,
        borderColor: 'grey'
    },
    footer2: {
        flex: 1,
        width: '50%',
    },
    footer1Text: {
      color: 'springgreen',
      fontSize: 15,
      alignSelf: 'center'
    },
    footer2Text: {
      color: 'springgreen',
      fontSize: 15,
      alignSelf: 'center'
    },
    footer1Value: {
       color: 'springgreen',
       fontSize: 25,
       alignSelf: 'center'
    },
    footer2Value: {
       color: 'springgreen',
       fontSize: 25,
       alignSelf: 'center'
    }

});

export default RunHistoryScreen;