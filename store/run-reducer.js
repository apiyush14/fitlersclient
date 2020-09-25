import {ADD_RUN,LOAD_RUNS,UPDATE_SUMMARY,LOAD_RUN_SUMMARY} from './run-actions';
import RunDetails from '../models/rundetails';
import RunSummary from '../models/runsummary';

const initialState={
	runs:[],
    runSummary: null
};

export default (state=initialState, action)=>{
	switch(action.type) {
		case ADD_RUN:
        const newRun=new RunDetails(action.run.id, action.run.track_image,action.run.date,action.run.day,action.run.lapsedTime,action.run.totalDistance, action.run.averagePace, action.run.caloriesBurnt, action.run.path);
        
        return{...state, 
            runs: state.runs.concat(newRun)
        };

        case LOAD_RUNS:
        return {...state, 
            runs: action.runs[0].map((run)=>
                {  
                    var pathArr=run.PATH.split(";");

                    var path=pathArr.map(loc=>{
                        var locationArr=loc.split(",");
                        var location={
                            latitude: parseFloat(locationArr[0]),
                            longitude: parseFloat(locationArr[1])
                        };
                        return location;
                    });

                    console.log('Final Path Array after conversion is ');
                    console.log(path);
                    return new RunDetails(run.id.toString(), run.TRACK_IMAGE.toString(),run.RUN_DATE.toString(),run.RUN_DAY.toString(),run.LAPSED_TIME.toString(),run.TOTAL_DISTANCE.toString(),run.AVERAGE_PACE, run.CALORIES_BURNT, path);})
        };

        case UPDATE_SUMMARY:
        //console.log("Updating Summary");
        //console.log(action.runSummary);
        const updatedSummary=action.runSummary;
        //const updatedSummary=new RunSummary(action.runSummary.id.toString(),action.runSummary.TOTAL_DISTANCE.toString(), action.runSummary.TOTAL_RUNS.toString(),action.runSummary.AVERAGE_PACE.toString(),action.runSummary.AVERAGE_DISTANCE.toString())
        return {...state,
             runSummary: new RunSummary(updatedSummary.id.toString(), updatedSummary.TOTAL_DISTANCE.toString(), updatedSummary.TOTAL_RUNS.toString(),updatedSummary.AVERAGE_PACE.toString(),updatedSummary.AVERAGE_DISTANCE.toString())
        };

        case LOAD_RUN_SUMMARY:
        const loadedSummary=action.runSummary;
        return {...state,
             runSummary: new RunSummary(loadedSummary.id.toString(), loadedSummary.TOTAL_DISTANCE.toString(),loadedSummary.TOTAL_RUNS.toString(),loadedSummary.AVERAGE_PACE.toString(),loadedSummary.AVERAGE_DISTANCE.toString())
        };

		default:
		return state;
	}
	return state;
};