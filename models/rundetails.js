/*
Model Class for Run History Item
*/

class RunDetails{
	constructor(id,track_image,date,day,lapsedTime,totalDistance,averagePace,caloriesBurnt,path){
     this.id=id;
     this.track_image=track_image;
     this.date=date;
     this.day=day;
     this.lapsedTime=lapsedTime;
     this.totalDistance=totalDistance;
     this.averagePace=averagePace;
     this.caloriesBurnt=caloriesBurnt;
     this.path=path;
	}
}

export default RunDetails;