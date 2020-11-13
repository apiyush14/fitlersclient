/*
Model Class for Event Details
*/

class EventDetails{
     constructor(eventId,eventOrganizerFirstName,eventOrganizerLastName,eventOrganizerContactNumber,eventName,eventDescription,eventStartDate,eventEndDate,eventDisplayPic,eventMetricType,eventMetricValue){
      this.eventId=eventId;
      this.eventOrganizerFirstName=eventOrganizerFirstName;
      this.eventOrganizerLastName=eventOrganizerLastName;
      this.eventOrganizerContactNumber=eventOrganizerContactNumber;
      this.eventName=eventName;
      this.eventDescription=eventDescription;
      this.eventStartDate=eventStartDate;
      this.eventEndDate=eventEndDate;
      this.eventDisplayPic=eventDisplayPic;
      this.eventMetricType=eventMetricType;
      this.eventMetricValue=eventMetricValue;
     }
}

export default EventDetails;