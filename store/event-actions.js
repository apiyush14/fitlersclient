import NetInfo from '@react-native-community/netinfo';
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';

export const UPDATE_EVENTS_FROM_SERVER='UPDATE_EVENTS_FROM_SERVER';

export const loadEventsFromServer=()=>{
 return async dispatch=>{
    var header= await dispatch(getUserAuthenticationToken());
 return new Promise((resolve,reject)=>{
    var URL="http://192.168.1.66:7001/event-details/getEvents";
    console.log(header);
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
      console.log('================Error While loading===========');
      console.log(err);
      reject(err);
    });
});
}
};


export const registerUserForEvent=(eventId,userId)=>{
 return async dispatch=>{
    var header= await dispatch(getUserAuthenticationToken());
 return new Promise((resolve,reject)=>{
    var URL="http://192.168.1.66:7001/event-registration/registerForEvent/"+eventId+"?userId="+header.USER_ID;
    console.log('URL is');
    console.log(URL);
    fetch(URL, { 
    method: 'POST', 
    headers: header
  }).then(response => response.json())
    .then((response)=> {
     //console.log('POST API results');
     //console.log(response);
     resolve();
    }).catch(err=>{
      reject(err);
    });
});
}
};
