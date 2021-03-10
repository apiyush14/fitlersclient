import {UPDATE_EVENTS_FROM_SERVER,UPDATE_EVENT_REGISTRATION_DETAILS,UPDATE_EVENT_RESULT_DETAILS} from './event-actions';
import EventDetails from '../models/eventdetails';
import EventResultDetails from '../models/eventResultDetails';

const initialState={
	eventDetails:[],
    eventRegistrationDetails:[],
    eventResultDetails:[]
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

        case UPDATE_EVENT_RESULT_DETAILS:
        var updatedEventResultDetails=action.eventResultDetails.map((eventResult)=>{
            if(state.eventResultDetails.findIndex(eventResultState=>eventResultState.runId===eventResult.runId)<0){
            return new EventResultDetails(eventResult.eventId,eventResult.runId,eventResult.userRank);
        }
       }).filter(updatedEventResult=>updatedEventResult!==undefined);
        state.eventResultDetails=state.eventResultDetails.concat(updatedEventResultDetails);
        return state;

        case 'CLEAN_EVENT_STATE':
        state.eventDetails=[];
        state.eventRegistrationDetails=[];
        state.eventResultDetails=[];
        return state; 

		default:
		return state;
	}
	return state;
};