import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions,ActivityIndicator} from 'react-native';
import RunHistoryList from '../components/RunHistoryList';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from "@react-navigation/native";
import DashboardItem from '../components/DashboardItem';
import * as runActions from '../store/run-actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunHistoryScreen = props=>{

  //State Variables
  const isFocused = useIsFocused();
  const dispatch=useDispatch();
  const [isLoading, setIsLoading]=useState(false);
/*const unsubscribe = props.navigation.addListener('didFocus', () => {
    toggleCircle();
  });*/

  // State Selectors
  const runsHistory = useSelector(state => state.runs.runs);
  const runSummary=useSelector(state => state.runs.runSummary);
  const pendingRunsForSync=useSelector(state=>state.runs.runs.filter(run => run.isSyncDone==="0"));
  
  // Use Effect Hook to be loaded everytime the screen loads
  useEffect(() => {
    let networkSubscriber;
    if(isFocused){
           //console.log('Run History');
           //console.log(pendingRunsForSync);
           syncPendingRuns();
           networkSubscriber = NetInfo.addEventListener(state => {
             handleNetworkStateChanges(state.type);
           });
         }
         //Unsubscribe the event listener
         else if(networkSubscriber){
          networkSubscriber();
        }
      }, [props, isFocused]);

//Event Listener to sync the run history from server once the network state changes to connected
const handleNetworkStateChanges=(type) => {
  switch (type) {
    case 'none':
    case 'unknown':
            // offline statuses, so do nothing
            return
            //TODO To be tested
            default:
            syncPendingRuns();
          }
        };
 
  // Method to Upload New Runs to Server
  const syncPendingRuns=()=>{
          NetInfo.fetch().then(state=>{
        //console.log('Network State');
        //console.log(state);
        if(state.isConnected&&pendingRunsForSync!==null&&pendingRunsForSync.length>0){
         dispatch(runActions.syncPendingRuns(pendingRunsForSync)).then(()=>{

         }).catch(err=>{

         });
       }
     });
        };

     //Method to lazy load Runs from server 
      const loadMoreDataFromServer=()=>{
         setIsLoading(true);
         let pageNumber=Math.floor(runsHistory.length/3);
         //console.log('Going with page number');
         //console.log(pageNumber);
         NetInfo.fetch().then(state=>{
        if(state.isConnected&&runsHistory.length>0&&(runsHistory[runsHistory.length-1].runId>1)){
          dispatch(runActions.loadRunsFromServer(pageNumber)).then(()=>{
          //console.log('Load from Server Completed');
          setIsLoading(false);
        }).catch(err=>{
          //console.log('In error block');
          setIsLoading(false);
        });
       }
       else{
        setIsLoading(false);
      }
    });
       };  

//Event Listener to be called on selecting Run and to navigate to Run History Screen
const onSelectRunHistoryItem=(itemdata)=>{
  props.navigation.navigate('RunDetailsScreen', {
    runTrackSnapUrl:itemdata.item.runTrackSnapUrl,
    runDate:itemdata.item.runDate,
    runDay:itemdata.item.runDay,
    runTotalTime:itemdata.item.runTotalTime,
    runDistance:itemdata.item.runDistance,
    runPace:itemdata.item.runPace,
    runCaloriesBurnt: itemdata.item.runCaloriesBurnt,
    runPath: itemdata.item.runPath,
    sourceScreen: 'RunHistoryScreen' 
  });
};

// Run History Footer for Activity Loader
const renderRunSummaryFooter=()=>{
 return (
  <View>
  {isLoading?
    (
     <ActivityIndicator size="large" color="green"/>
     ):
    (
     <View></View>
     )
   }
   </View>
   );
  };

// Run Summary Header View Renderer
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
    footerText="Avg Distance"
    style={styles.averageDistanceDashboardItem} 
    icon="ios-stats"/>
    <DashboardItem 
    text={runSummary!=null?parseFloat(runSummary.averagePace).toFixed(2):0.00}
    footerText="Avg Pace"
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
   onEndReached={loadMoreDataFromServer}
   isLoading={isLoading}
   header={renderRunSummaryHeader()}
   footer={renderRunSummaryFooter()}
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