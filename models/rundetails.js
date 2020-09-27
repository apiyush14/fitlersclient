/*
Model Class for Run History Item
*/

class RunDetails{
     constructor(runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl){
     this.runId=runId;
     this.runTotalTime=runTotalTime;
     this.runDistance=runDistance;
     this.runPace=runPace;
     this.runCaloriesBurnt=runCaloriesBurnt;
     this.runCredits=runCredits;
     this.runDate=runDate;
     this.runDay=runDay;
     this.runPath=runPath;
     this.runTrackSnapUrl=runTrackSnapUrl;
     }
}

export default RunDetails;