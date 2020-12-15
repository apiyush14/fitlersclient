import {UPDATE_EVENTS_FROM_SERVER,UPDATE_EVENT_REGISTRATION_DETAILS} from './event-actions';
import EventDetails from '../models/eventdetails';

const initialState={
	eventDetails:[],
    eventRegistrationDetails:[]
};

export default (state=initialState, action)=>{
	switch(action.type) {
        case UPDATE_EVENTS_FROM_SERVER:
        var updatedEventsFromServer=action.eventDetails.map((event)=>{
            if(state.eventDetails.findIndex(eventState=>eventState.eventId===event.eventId)<0){
            return new EventDetails(event.eventId,event.eventOrganizerFirstName,event.eventOrganizerLastName,event.eventOrganizerContactNumber,event.eventName,event.eventDescription,event.eventStartDate,event.eventEndDate,event.eventDisplayPic,event.eveventMetricType,event.eventMetricValue);
        }
       }).filter(updatedEvent=>updatedEvent!==undefined);
        state.eventDetails=state.eventDetails.concat(updatedEventsFromServer);
        return state;

        case UPDATE_EVENT_REGISTRATION_DETAILS:
        var updatedEventRegistrationDetails=action.eventRegistrationDetails.map((event)=>{
            if(state.eventRegistrationDetails.findIndex(eventState=>eventState.eventId===event.eventId)<0){
            return new EventDetails(event.eventId,event.eventOrganizerFirstName,event.eventOrganizerLastName,event.eventOrganizerContactNumber,event.eventName,event.eventDescription,event.eventStartDate,event.eventEndDate,event.eventDisplayPic,event.eveventMetricType,event.eventMetricValue);
        }
       }).filter(updatedEvent=>updatedEvent!==undefined);
        state.eventRegistrationDetails=state.eventRegistrationDetails.concat(updatedEventRegistrationDetails);
        return state;

		default:
		return state;
	}
	return state;
};