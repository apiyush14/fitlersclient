import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import UserDetails from '../models/userDetails';
import Response from '../models/response';
import {cleanUpAllData} from '../utils/DBUtils';

export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';
export const CLEAN_USER_STATE = 'CLEAN_USER_STATE';

//Method to Load User Details first from local DB, and then from server in case needed and hydrate local DB
export const loadUserDetails = () => {
  return async dispatch => {
    //Sync Fetch User Details from Local DB
    return dispatch(fetchUserDetails()).then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else if (response.data.userFirstName !== null) {
          //Async Dispatch User Details Update State
          dispatch({
            type: UPDATE_USER_DETAILS,
            userDetails: response.data
          });
          return new Response(200, response.data);
        } else {
          //Sync Dispatch Load User Details from Server Action
          return dispatch(loadUserDetailsFromServer()).then((response) => {
            if (response.status >= 400) {
              return new Response(response.status, null);
            } else if (response.data.userFirstName !== null) {
              //Hydrate Local DB Async
              dispatch(updateUserDetailsInDB(response.data.userFirstName, response.data.userLastName, response.data.userHeight, response.data.userWeight));
            }
            return new Response(200, response.data);
          });
        }
      })
      .catch(err => {
        return new Response(500, null);
      });
  }
};

//Load User Details from Local DB or from server
export const loadUserDetailsFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(405, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var URL = configData.SERVER_URL + "user/getDetails/" + userId;
    return fetch(URL, {
        method: 'GET',
        headers: header
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else if (response.userDetails !== null && response.userDetails.userFirstName !== null) {
          //Async Dispatch User Details Update State
          dispatch({
            type: UPDATE_USER_DETAILS,
            userDetails: response.userDetails
          });
        }
        return new Response(200, response.userDetails);
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//TODO Names should be encrypted
//Method to Update User Details on Server and local Async DB
export const updateUserDetails = (firstName, lastName, height, weight) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(405, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var userDetails = {
      userFirstName: firstName,
      userLastName: lastName,
      userHeight: height,
      userWeight: weight
    }

    var URL = configData.SERVER_URL + "user/updateDetails/" + userId;
    return fetch(URL, {
        method: 'PUT',
        headers: header,
        body: JSON.stringify({
          userDetails: userDetails
        })
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else if (response === true) {
          //Async Update State for User Details
          dispatch({
            type: UPDATE_USER_DETAILS,
            userDetails: userDetails
          });

          //Sync Update User Details in Async DB
          return dispatch(updateUserDetailsInDB(firstName, lastName, height, weight)).then((response) => {
            if (response.status >= 400) {
              return new Response(response.status, null);
            } else {
              return new Response(200, response.data);
            }
          });
        } else {
          return new Response(200, userDetails);
        }
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Private Method to load User Details from Async Storage
const fetchUserDetails = () => {
  return async dispatch => {
    try {
      var userFirstName = await AsyncStorage.getItem('USER_FIRST_NAME');
      var userLastName = await AsyncStorage.getItem('USER_LAST_NAME');
      var userHeight = await AsyncStorage.getItem('USER_HEIGHT');
      var userWeight = await AsyncStorage.getItem('USER_WEIGHT');
      var userDetails = new UserDetails(userFirstName, userLastName, userHeight, userWeight);
      return new Response(200, userDetails);
    } catch (err) {
      return new Response(500, null);
    };
  }
};

//Private method to update user details in Async DB
const updateUserDetailsInDB = (userFirstName, userLastName, userHeight, userWeight) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_FIRST_NAME', userFirstName);
      await AsyncStorage.setItem('USER_LAST_NAME', userLastName);
      await AsyncStorage.setItem('USER_HEIGHT', userHeight.toString());
      await AsyncStorage.setItem('USER_WEIGHT', userWeight.toString());
      var userDetails = new UserDetails(userFirstName, userLastName, userHeight, userWeight);
      return new Response(200, userDetails);
    } catch (err) {
      return new Response(500, null);
    };
  }
};

//Pending
export const cleanUpUserData = () => {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem('USER_ID');
      await AsyncStorage.removeItem('USER_SECRET_KEY');
      await AsyncStorage.removeItem('USER_FIRST_NAME');
      await AsyncStorage.removeItem('USER_LAST_NAME');
      await AsyncStorage.removeItem('USER_HEIGHT');
      await AsyncStorage.removeItem('USER_WEIGHT');
      await cleanUpAllData();
    } catch (err) {

    };
  }
};