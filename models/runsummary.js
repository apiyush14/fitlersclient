/*
Model Class for Run Summary
*/

class RunSummary{
	constructor(id,totalDistance,totalRuns,averagePace,averageDistance){
     this.id=id;
     this.totalDistance=totalDistance;
     this.totalRuns=totalRuns;
     this.averagePace=averagePace;
     this.averageDistance=averageDistance;
	}
}

export default RunSummary;