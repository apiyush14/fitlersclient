/*
Model Class for Run History Item
*/

class RunDetails{
     constructor(runId,runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runStartDateTime,runDate,runDay,runPath,runTrackSnapUrl,isSyncDone){
     this.runId=runId;
     this.runTotalTime=runTotalTime;
     this.runDistance=runDistance;
     this.runPace=runPace;
     this.runCaloriesBurnt=runCaloriesBurnt;
     this.runCredits=runCredits;
     this.runStartDateTime=runStartDateTime;
     this.runDate=runDate;
     this.runDay=runDay;
     this.runPath=runPath;
     this.runTrackSnapUrl=runTrackSnapUrl;
     this.isSyncDone=isSyncDone;
     }
}

export default RunDetails;