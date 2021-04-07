/*
Model Class for Event Result Details With User Details
*/

class EventResultDetailsWithUserDetails{
     constructor(eventId,userId,userFirstName,userLastName,userRank,runTotalTime){
      this.eventId=eventId;
      this.userId=userId;
      this.userFirstName=userFirstName;
      this.userLastName=userLastName;
      this.userRank=userRank;
      this.runTotalTime=runTotalTime;
     }
}

export default EventResultDetailsWithUserDetails;