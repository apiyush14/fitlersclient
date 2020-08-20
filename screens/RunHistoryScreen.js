import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions} from 'react-native';
import RunHistoryList from '../components/RunHistoryList';
import { useSelector, useDispatch } from 'react-redux';
import * as runActions from '../store/run-actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RunHistoryScreen = props=>{
const runsHistory = useSelector(state => state.runs.runs);
const dispatch=useDispatch();

useEffect(()=>{
    dispatch(runActions.loadRuns());
  }, [dispatch]);


return (
         <View style={styles.runHistoryContainer}>
         <View style={styles.runsHistoryDetailsPanel}>
         <Text>Total Distance</Text>
         <Text>Total Runs</Text>
         <Text>Average Distance</Text>
         <Text>Average Pace</Text>
         </View>
         <View style={styles.runsScrollPanel}>
         <RunHistoryList listData={runsHistory}/>
         </View>
         </View>
		);
};

const styles = StyleSheet.create({
    runHistoryContainer: {
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'column',
    },
    runsHistoryDetailsPanel: {
        height: '25%'
    },
    runsScrollPanel: {
        flex:1
    }
});

export default RunHistoryScreen;