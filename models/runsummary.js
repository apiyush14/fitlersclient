/*
Model Class for Run Summary
*/

class RunSummary{
	constructor(id,totalDistance,totalRuns,totalCredits,averagePace,averageDistance,averageCaloriesBurnt){
     this.id=id;
     this.totalDistance=totalDistance;
     this.totalRuns=totalRuns;
     this.totalCredits=totalCredits;
     this.averagePace=averagePace;
     this.averageDistance=averageDistance;
     this.averageCaloriesBurnt=averageCaloriesBurnt;
	}
}

export default RunSummary;