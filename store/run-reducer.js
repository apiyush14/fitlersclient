import {UPDATE_RUN_DETAILS,UPDATE_RUN_SUMMARY,LOAD_RUN_SUMMARY,UPDATE_RUN_SYNC_STATE} from './run-actions';
import RunDetails from '../models/rundetails';
import RunSummary from '../models/runsummary';

const initialState={
	runs:[],
    runSummary: null
};

export default (state=initialState, action)=>{
	switch(action.type) {

        case UPDATE_RUN_DETAILS:
        var updatedRuns=action.runs.map((run)=>{
            //console.log('Run Updated From Server');
            //console.log(run);
            //console.log(state.runs.findIndex(stateRun=>stateRun.runId===run.runId));
        if(state.runs.findIndex(stateRun=>stateRun.runId===run.runId)<0){
            //console.log('Inside condition');
            var pathArr=run.runPath.split(";");
            var path=pathArr.map(loc=>{
            var locationArr=loc.split(",");
            var location={
                latitude: parseFloat(locationArr[0]),
                longitude: parseFloat(locationArr[1])
                        };
                return location;
                });
            return new RunDetails(run.runId, run.runTotalTime,run.runDistance,run.runPace,run.runCaloriesBurnt,run.runCredits,run.runStartDateTime,run.runDate, run.runDay, path, run.runTrackSnapUrl, run.isSyncDone);
        }
       }).filter(updatedRun=>updatedRun!==undefined);
        //console.log('Updated Runs from server');
        //console.log(updatedRunsFromServer);
        state.runs=state.runs.concat(updatedRuns);
        state.runs.sort(function(a,b){
          return new Date(b.runStartDateTime)-new Date(a.runStartDateTime);
       });
        return state;

        case UPDATE_RUN_SUMMARY:
        //console.log("Updating Summary");
        //console.log(action.runSummary);
        const updatedSummary=action.runSummary;
        //const updatedSummary=new RunSummary(action.runSummary.id.toString(),action.runSummary.TOTAL_DISTANCE.toString(), action.runSummary.TOTAL_RUNS.toString(),action.runSummary.AVERAGE_PACE.toString(),action.runSummary.AVERAGE_DISTANCE.toString())
        return {...state,
             runSummary: new RunSummary("1", updatedSummary.totalDistance.toString(), updatedSummary.totalRuns.toString(),updatedSummary.averagePace.toString(),updatedSummary.averageDistance.toString())
        };

        case UPDATE_RUN_SYNC_STATE:
        let i;
        const pendingRunsForSync=action.pendingRunsForSync;
        for(i=0;i<pendingRunsForSync.length;i++){
            let runToBeUpdatedIndex=state.runs.findIndex(run=>run.runId===pendingRunsForSync[i].runId);
            state.runs[runToBeUpdatedIndex].isSyncDone="1";
        }
        return state;

		default:
		return state;
	}
	return state;
};