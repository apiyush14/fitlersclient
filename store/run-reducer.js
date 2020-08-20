import {ADD_RUN,LOAD_RUNS} from './run-actions';
import RunDetails from '../models/rundetails';

const initialState={
	runs:[]
};

export default (state=initialState, action)=>{
	switch(action.type) {
		case ADD_RUN:
        const newRun=new RunDetails(action.run.id, action.run.track_image,action.run.date,action.run.day,action.run.lapsedTime,action.run.totalDistance);
        return{
        	runs: state.runs.concat(newRun)
        };

        case LOAD_RUNS:
        return {
             runs: action.runs[0].map(run=>new RunDetails(run.id.toString(), run.track_image.toString(),run.date.toString(),run.day.toString(),run.lapsedTime.toString(),run.totalDistance.toString()))
        };
		default:
		return state;
	}
	return state;
};