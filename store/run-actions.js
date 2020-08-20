import {insertRun, fetchRuns} from '../utils/DBUtils';
import * as FileSystem from 'expo-file-system';

export const ADD_RUN='ADD_RUN';
export const LOAD_RUNS='LOAD_RUNS';

export const addRun=(track_image, date, day, lapsedTime, totalDistance)=>{
	return async dispatch=>{
        try{
           /* await FileSystem.moveAsync({
            from: track_image,
            to: newPath
        });*/
        var filePathPrefix="file://";
        var filePath=filePathPrefix.concat(track_image.toString());
        const dbResult= await insertRun(filePath,date.toString(),day.toString(),lapsedTime.toString(),totalDistance.toString());
        dispatch({type: ADD_RUN, run: {id: dbResult.insertId.toString(), track_image: filePath, date: date.toString(), day: day.toString(),lapsedTime: lapsedTime.toString(),totalDistance: totalDistance.toString() }});
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