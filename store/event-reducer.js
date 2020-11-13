import {UPDATE_EVENTS_FROM_SERVER} from './event-actions';
import EventDetails from '../models/eventdetails';

const initialState={
	eventDetails:[]
};

export default (state=initialState, action)=>{
	switch(action.type) {
        case UPDATE_EVENTS_FROM_SERVER:
        console.log('Insdie reducer');
        var updatedEventsFromServer=action.eventDetails.map((event)=>{
            return new EventDetails(event.eventId,event.eventOrganizerFirstName,event.eventOrganizerLastName,event.eventOrganizerContactNumber,event.eventName,event.eventDescription,event.eventStartDate,event.eventEndDate,event.eventDisplayPic,event.eveventMetricType,event.eventMetricValue);
       });
        state.eventDetails=state.eventDetails.concat(updatedEventsFromServer);
        console.log(state.eventDetails);
        return state;

		default:
		return state;
	}
	return state;
};