import {insertRun,fetchRuns,fetchRunSummary,updateRunSummary,insertRunSummary} from '../utils/DBUtils';
import * as FileSystem from 'expo-file-system';

export const ADD_RUN='ADD_RUN';
export const LOAD_RUNS='LOAD_RUNS';
export const UPDATE_SUMMARY='UPDATE_SUMMARY';
export const LOAD_RUN_SUMMARY='LOAD_RUN_SUMMARY';

export const addRun=(track_image, date, day, lapsedTime, totalDistance,averagePace, caloriesBurnt,path)=>{
	return async dispatch=>{
        try{
           /* await FileSystem.moveAsync({
            from: track_image,
            to: newPath
        });*/
        var pathString=path.map((location)=>""+location.latitude+","+location.longitude).join(';');

        console.log('Path String is');
        console.log(pathString);

        var filePathPrefix="file://";
        var filePath=filePathPrefix.concat(track_image.toString());
        
        const dbResult= await insertRun(filePath,date.toString(),day.toString(),lapsedTime.toString(),totalDistance.toString(),averagePace.toString(),caloriesBurnt.toString(), pathString);
        
        const dbResultForRunSummary=await fetchRunSummary();
        
        var dbResultUpdatedRunSummary;
        var updatedRunSummary;

        if(dbResultForRunSummary.rows._array.length===0)
        {
         console.log("Called in initial state");
         dbResultUpdatedRunSummary= await insertRunSummary(totalDistance, "1", averagePace, totalDistance);
        }
        else{    
          updatedRunSummary={
          totalDistance: parseFloat(dbResultForRunSummary.rows._array[0].TOTAL_DISTANCE)+parseFloat(totalDistance),
          totalRuns: parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS)+1,
          averagePace: ((parseFloat(dbResultForRunSummary.rows._array[0].AVERAGE_PACE)*parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS))+averagePace)/(parseInt(dbResultForRunSummary.rows._array[0].TOTAL_RUNS)+1),
          averageDistance: dbResultForRunSummary.rows._array[0].TOTAL_DISTANCE/dbResultForRunSummary.rows._array[0].TOTAL_RUNS
        };
         dbResultUpdatedRunSummary= await updateRunSummary(updatedRunSummary.totalDistance, updatedRunSummary.totalRuns, updatedRunSummary.averagePace, updatedRunSummary.averageDistance);
        }
        
        dispatch({type: ADD_RUN, run: {id: dbResult.insertId.toString(), track_image: filePath, date: date.toString(), day: day.toString(),lapsedTime: lapsedTime.toString(),totalDistance: totalDistance.toString(), averagePace: averagePace.toString(), caloriesBurnt: caloriesBurnt.toString(), path: path}});
        
        if(dbResultUpdatedRunSummary.rows._array.length>0){
           console.log("Updating Run Summary from DB");
           console.log(dbResultUpdatedRunSummary.rows._array[0]);
          dispatch({type: UPDATE_SUMMARY,runSummary:dbResultUpdatedRunSummary.rows._array[0]});
        }
        else{
            console.log("Updating Run Summary from source");
            console.log(updatedRunSummary);
          dispatch({type: UPDATE_SUMMARY,runSummary:{id: 1, TOTAL_DISTANCE: updatedRunSummary.totalDistance,TOTAL_RUNS: updatedRunSummary.totalRuns,AVERAGE_PACE: updatedRunSummary.averagePace,AVERAGE_DISTANCE: updatedRunSummary.averageDistance}});
        } 

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
    dispatch({type: LOAD_RUNS, runs:[dbResult.rows._array]});
}
catch(err){
	console.log(err);
	throw err;
 };
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