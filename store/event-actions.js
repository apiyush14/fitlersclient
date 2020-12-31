import NetInfo from '@react-native-community/netinfo';
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import {insertEventRegistrationDetails,fetchEventRegistrationDetails} from '../utils/DBUtils';
import configData from "../config/config.json";

export const UPDATE_EVENTS_FROM_SERVER='UPDATE_EVENTS_FROM_SERVER';
export const UPDATE_EVENT_REGISTRATION_DETAILS='UPDATE_EVENT_REGISTRATION_DETAILS';
export const UPDATE_EVENT_RESULT_DETAILS='UPDATE_EVENT_RESULT_DETAILS';

export const loadEventsFromServer=(pageNumber)=>{
 return async dispatch=>{
    var header= await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
 return new Promise((resolve,reject)=>{
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });

    var URL=configData.SERVER_URL +"event-details/getEvents/"+ userId + "?page=";
    URL = URL + pageNumber;;
    fetch(URL, { 
    method: 'GET',
    headers: header
  }).then(response => response.json())
    .then((response)=> {
     //console.log('===============GET API results');
     //console.log(response);
     dispatch({type: UPDATE_EVENTS_FROM_SERVER, eventDetails:response.eventDetails});
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};

//Method to Load Event Registration Details first from local DB, and then from server in case needed and hydrate local DB
export const loadEventRegistrationDetails = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      //Fetch Event Registration Details from Local DB
      fetchEventRegistrationDetails().then(response => {
          if (response.rows._array.length > 0) {
            var updatedEventRegistrationDetails = response.rows._array.map((eventRegistrationDetails) => {
              var updatedEventRegisration = {
                  eventId: eventRegistrationDetails.EVENT_ID,
                  eventName: eventRegistrationDetails.EVENT_NAME,
                  eventDescription: eventRegistrationDetails.EVENT_DESCRIPTION,
                  eventStartDate: eventRegistrationDetails.EVENT_START_DATE,
                  eventEndDate: eventRegistrationDetails.EVENT_END_DATE
              };
              return updatedEventRegisration;
            });

            //Dispatch Event Registration State Update
            dispatch({
              type: UPDATE_EVENT_REGISTRATION_DETAILS,
              eventRegistrationDetails: updatedEventRegistrationDetails
            });
          } else {
            //Dispatch Load Event Registration from Server Action
            dispatch(loadEventRegistrationDetailsFromServer(0)).then((response) => {
              if (response.eventDetails.length > 0) {
                response.eventDetails.map((eventDetails) => {
                  //Hydrate Local DB
                  insertEventRegistrationDetails(eventDetails.eventId,eventDetails.eventName,eventDetails.eventDescription,eventDetails.eventStartDate,eventDetails.eventEndDate);
                });
              }
            });
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

//Method to Load Event Registration Details from server based on pageNumber provided
export const loadEventRegistrationDetailsFromServer = (pageNumber) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });
      var URL = configData.SERVER_URL + "event-registration/getRegisteredEventsForUser/" + userId;
      fetch(URL, {
          method: 'GET',
          headers: header
        }).then(response => response.json())
        .then((response) => {
          if (response.eventDetails.length > 0) {
            var updatedEventRegistrationDetails = response.eventDetails.map((eventRegistrationDetails) => {
              var updatedEventRegisration = {
                  eventId: eventRegistrationDetails.eventId,
                  eventName: eventRegistrationDetails.eventName,
                  eventDescription: eventRegistrationDetails.eventDescription,
                  eventStartDate: eventRegistrationDetails.eventStartDate,
                  eventEndDate: eventRegistrationDetails.eventEndDate
              };
              return updatedEventRegisration;
            });
            //Dispatch Event Registration Update State
            dispatch({
              type: UPDATE_EVENT_REGISTRATION_DETAILS,
              eventRegistrationDetails: updatedEventRegistrationDetails
            })
          }
          resolve(response);
        }).catch(err => {
          reject(err);
        });
    });
  }
};

export const registerUserForEvent=(eventDetails)=>{
 return async dispatch=>{
    var header= await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
 return new Promise((resolve,reject)=>{
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });
    var URL=configData.SERVER_URL +"event-registration/registerForEvent/"+eventDetails.eventId+"?userId="+userId;
    fetch(URL, { 
    method: 'POST', 
    headers: header
  }).then(response => response.json())
    .then((response)=> {
     //console.log('POST API results');
     //console.log(response);
     dispatch(updateEventRegistrationDetails(eventDetails));
     var eventRegistrationDetailsList=[];
     var eventRegistrationDetails={
      eventId: eventDetails.eventId,
      eventName: eventDetails.eventName,
      eventDescription: eventDetails.eventDescription,
      eventStartDate: eventDetails.eventStartDate,
      eventEndDate: eventDetails.eventEndDate
     };
     eventRegistrationDetailsList=eventRegistrationDetailsList.concat(eventRegistrationDetails);
     dispatch({type: UPDATE_EVENT_REGISTRATION_DETAILS,eventRegistrationDetails: eventRegistrationDetailsList});
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};


export const updateEventRegistrationDetails=(eventDetails)=>{
 return async dispatch=>{
    return new Promise((resolve,reject)=>{
     insertEventRegistrationDetails(eventDetails.eventId,eventDetails.eventName,eventDetails.eventDescription,eventDetails.eventStartDate,eventDetails.eventEndDate);
});
}
};

//Method to Load Event Result Details from server
export const loadEventResultDetailsFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });
      var URL = configData.SERVER_URL + "event-results/" + userId;
      fetch(URL, {
          method: 'GET',
          headers: header
        }).then(response => response.json())
        .then((response) => {
          if (response.eventResultDetails&&response.eventResultDetails.length > 0) {
            var updatedEventResultDetails = response.eventResultDetails.map((eventResultDetails) => {
              var updatedEventResult = {
                  eventId: eventResultDetails.eventId,
                  runId: eventResultDetails.runId,
                  userRank: eventResultDetails.userRank
              };
              return updatedEventResult;
            });
            //Dispatch Event Result Update State
            dispatch({
              type: UPDATE_EVENT_RESULT_DETAILS,
              eventResultDetails: updatedEventResultDetails
            })
          }
          resolve(response);
        }).catch(err => {
          reject(err);
        });
    });
  }
};