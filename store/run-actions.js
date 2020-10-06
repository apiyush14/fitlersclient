import {insertRun,fetchRuns,fetchRunSummary,updateRunSummary,insertRunSummary,updateRunsSyncState,deleteRuns} from '../utils/DBUtils';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';

export const ADD_RUN='ADD_RUN';
export const LOAD_RUNS='LOAD_RUNS';
export const UPDATE_SUMMARY='UPDATE_SUMMARY';
export const LOAD_RUN_SUMMARY='LOAD_RUN_SUMMARY';
export const UPDATE_RUN_SYNC_STATE='UPDATE_RUN_SYNC_STATE';
export const UPDATE_RUNS_FROM_SERVER='UPDATE_RUNS_FROM_SERVER';

export const addRun=(runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl)=>{
	return async dispatch=>{
        try{
           /* await FileSystem.moveAsync({
            from: track_image,
            to: newPath
        });*/
        //console.log('Add Run');

       const existingRuns=await fetchRuns();
       existingRuns.rows._array.sort(function(a,b){
        return parseInt(b.RUN_ID)-parseInt(a.RUN_ID);
       });

       if(existingRuns&&existingRuns.rows._array.length>2){
          var runsToBeDeleted;
          let runIdsToBeDeleted="";
          for(runsToBeDeleted=existingRuns.rows._array.length-2; runsToBeDeleted>0;runsToBeDeleted-- ){
              //runIdsToBeDeleted=runIdsToBeDeleted.concat(existingRuns.rows._array[existingRuns.rows._array.length-runsToBeDeleted].RUN_ID);
              //deleteRun(existingRuns.rows._array[existingRuns.rows._array.length-runsToBeDeleted].RUN_ID);
              runIdsToBeDeleted=runIdsToBeDeleted+existingRuns.rows._array[existingRuns.rows._array.length-runsToBeDeleted].RUN_ID+",";
          }
          runIdsToBeDeleted= runIdsToBeDeleted.replace(/(^[,\s]+)|([,\s]+$)/g, '');
          deleteRuns(runIdsToBeDeleted);
       }

        var pathString=runPath.map((path)=>""+path.latitude+","+path.longitude).join(';');

        //console.log('Path String is');
        //console.log(pathString);

        var filePathPrefix="file://";
        var filePath=filePathPrefix.concat(runTrackSnapUrl.toString());
        
        const dbResult= await insertRun(runTotalTime.toString(),runDistance.toString(),runPace.toString(),runCaloriesBurnt.toString(),0,runDate.toString(),runDay.toString(),pathString,runTrackSnapUrl.toString(),"0");
        
        const dbResultForRunSummary=await fetchRunSummary();
        
        var dbResultUpdatedRunSummary;
        var updatedRunSummary;

        if(dbResultForRunSummary.rows._array.length===0)
        {
         //console.log("Called in initial state");
         dbResultUpdatedRunSummary= await insertRunSummary(runDistance, "1", runPace, runDistance);
        }
        else{    
          updatedRunSummary={
          totalDistance: parseFloat(dbResultForRunSummary.rows._array[0].TOTAL_DISTANCE)+parseFloat(runDistance),
          totalRuns: parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS)+1,
          averagePace: ((parseFloat(dbResultForRunSummary.rows._array[0].AVERAGE_PACE)*parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS))+runPace)/(parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS)+1),
          averageDistance: dbResultForRunSummary.rows._array[0].TOTAL_DISTANCE/dbResultForRunSummary.rows._array[0].TOTAL_RUNS
        };
         dbResultUpdatedRunSummary= await updateRunSummary(updatedRunSummary.totalDistance, updatedRunSummary.totalRuns, updatedRunSummary.averagePace, updatedRunSummary.averageDistance);
        }
        
        dispatch({type: ADD_RUN, run: {runId: dbResult.insertId.toString(), runTotalTime: runTotalTime, runDistance: runDistance, runPace: runPace, runCaloriesBurnt: runCaloriesBurnt, runCredits: runCredits, runDate: runDate, runDay: runDay, runPath: runPath, runTrackSnapUrl: runTrackSnapUrl, isSyncDone: "0"}});
        
        if(dbResultUpdatedRunSummary.rows._array.length>0){
           //console.log("Updating Run Summary from DB");
           //console.log(dbResultUpdatedRunSummary.rows._array[0]);
          dispatch({type: UPDATE_SUMMARY,runSummary:dbResultUpdatedRunSummary.rows._array[0]});
        }
        else{
            //console.log("Updating Run Summary from source");
            //console.log(updatedRunSummary);
          dispatch({type: UPDATE_SUMMARY,runSummary:{id: 1, TOTAL_DISTANCE: updatedRunSummary.totalDistance,TOTAL_RUNS: updatedRunSummary.totalRuns,AVERAGE_PACE: updatedRunSummary.averagePace,AVERAGE_DISTANCE: updatedRunSummary.averageDistance}});
        } 
      
      NetInfo.fetch().then(state=>{
        //console.log('Network State');
        //console.log(state);
        if(state.isConnected){
        //addRunToServer(dbResult.insertId.toString(),runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,pathString,runTrackSnapUrl);
      }
      });
    }
    catch(err){
    	console.log(err);
    	throw err;
    }
	};
};

export const loadRuns=()=>{
 return async dispatch=>{
 	try{
    const dbResult=await fetchRuns();
    dbResult.rows._array.sort(function(a,b){
      return parseInt(b.RUN_ID)-parseInt(a.RUN_ID);
    });
    dispatch({type: LOAD_RUNS, runs:[dbResult.rows._array]});
}
catch(err){
	console.log(err);
	throw err;
 };
}
};

export const loadRunsFromServer=(pageNumber)=>{
 return async dispatch=>{
 return new Promise((resolve,reject)=>{
    var URL="http://192.168.1.66:7001/run-details/user/piyush123/getAllRuns?page=";
    URL=URL+pageNumber;
    fetch(URL, { 
    method: 'GET', 
    headers: { 
    'Content-Type':'application/json' 
    }
  }).then(response => response.json())
    .then((response)=> {
     console.log('GET API results');
     console.log(response);
     dispatch({type: UPDATE_RUNS_FROM_SERVER, runs:response.runDetailsList})
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};

export const loadRunSummary=()=>{
 return async dispatch=>{
    try{
    const dbResult=await fetchRunSummary();
    if(dbResult.rows._array.length>0){
    dispatch({type: LOAD_RUN_SUMMARY, runSummary:dbResult.rows._array[0]});
  }
}
catch(err){
    console.log(err);
    throw err;
 };
}
};

export const syncPendingRuns=(pendingRunsForSync)=>{

//console.log('Inside Sync Pending Runs');
//console.log(pendingRunsForSync);

return async dispatch=>{
    try
       {
         //console.log('Inside dispatch');
         //console.log(pendingRunsForSync);

         let runDataArr=[];
         pendingRunsForSync.map(pendingRun=>{
          var pathString=pendingRun.runPath.map((path)=>""+path.latitude+","+path.longitude).join(';');
          const runData={
            runId: pendingRun.runId,
            userId: 'piyush123',
            runTotalTime: pendingRun.runTotalTime,
            runDistance: pendingRun.runDistance,
            runPace: pendingRun.runPace,
            runCaloriesBurnt: pendingRun.runCaloriesBurnt,
            runCredits: '0',
            runDate: pendingRun.runDate,
            runDay: pendingRun.runDay,
            runPath: pathString,
            runTrackSnapUrl: pendingRun.runTrackSnapUrl
          };
          runDataArr = runDataArr.concat(runData);
         });

    //console.log('Run Request');
    //console.log(runDataArr);
    const addRunsRequest={
      runDetailsList: runDataArr
    };
    
    fetch("http://192.168.1.66:7001/run-details/addRuns", { 
    method: 'POST', 
    headers: { 
    'Content-Type':'application/json' 
    }, 
    body: JSON.stringify({ 
      runDetailsList: runDataArr
   }) 
  }).then(response => response.json())
    .then((responseJson)=> {
      updateSyncStateInDB(pendingRunsForSync);
      dispatch({type: UPDATE_RUN_SYNC_STATE, pendingRunsForSync});
    });   
       }
catch(err){
    console.log(err);
    throw err;
 };
}
};

const addRunToServer=(runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,pathString,runTrackSnapUrl)=>{
    const runData={
      runId: runId,
      userId: 'piyush123',
      runTotalTime: runTotalTime,
      runDistance: runDistance,
      runPace: runPace,
      runCaloriesBurnt: runCaloriesBurnt,
      runCredits: '0',
      runDate: runDate,
      runDay: runDay,
      runPath: pathString,
      runTrackSnapUrl: runTrackSnapUrl
    };

    let runDataArr=[];
    runDataArr = runDataArr.concat(runData);
    syncPendingRuns(runDataArr);

    /*const addRunsRequest={
      runDetailsList: runDataArr
    };
    
    fetch("http://192.168.1.66:7001/run-details/addRuns", { 
    method: 'POST', 
    headers: { 
    'Content-Type':'application/json' 
    }, 
    body: JSON.stringify({ 
      runDetailsList: runDataArr
   }) 
  }).then(response={ 
    
  });*/
};

const updateSyncStateInDB=(pendingRunsForSync)=>{
  let pendingRunIds="";
  pendingRunsForSync.map(pendingRun=>{
    pendingRunIds=pendingRunIds+pendingRunsForSync.runId+",";
  });
  pendingRunIds= pendingRunIds.replace(/(^[,\s]+)|([,\s]+$)/g, '');
  try{
  const dbResult=  updateRunsSyncState(pendingRunIds);
  }
  catch(err){
     
  }

};