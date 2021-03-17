import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import * as userActions from './user-actions';
import Response from '../models/response';
import UserAuthenticationDetails from '../models/userAuthenticationDetails';

export const UPDATE_USER_AUTH_DETAILS = 'UPDATE_USER_AUTH_DETAILS';
export const CLEAN_AUTH_STATE = 'CLEAN_AUTH_STATE';

//Method to load User Auth Details from Async Storage and update state
export const loadUserAuthDetails = () => {
  return async dispatch => {
    //Sync Fetch Auth Details from Local DB
    return dispatch(fetchUserAuthDetails()).then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else if (response.data.userId !== null) {
          //Async Dispatch User Auth Details Update State
          dispatch({
            type: UPDATE_USER_AUTH_DETAILS,
            authDetails: response.data
          });
        }
        return new Response(200, response.data);
      })
      .catch(err => {
        return new Response(500, null);
      });
  }
};

//TODO MSISDN should be encrypted
//Generate OTP for MSISDN Sync Action
export const generateOTPForMSISDN = (msisdn) => {
  return async dispatch => {
    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(405, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var URL = configData.SERVER_URL + "auth/getOTP/" + msisdn;
    return fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else {
          return new Response(200, response);
        }
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Sync Method to Validate entered OTP and update state and hydrate local DB
export const validateOTPForMSISDN = (msisdn, otpCode) => {
  return async dispatch => {
    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(405, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var URL = configData.SERVER_URL + "auth/validateOTP/" + msisdn + "?otpCode=" + otpCode;
    return fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          return new Response(response.status, null);
        } else if (response.isValid === true) {
          //Async dispatch to update state for Auth Details
          dispatch({
            type: UPDATE_USER_AUTH_DETAILS,
            authDetails: response
          });
          //Sync dispatch to update Auth Details in Async Storage
          return dispatch(updateUserAuthenticationDetailsInDB(response)).then((response) => {
            if (response.status >= 400) {
              return new Response(response.status, null);
            } else {
              return new Response(200, response.data);
            }
          });
        } else {
          return new Response(200, response);
        }
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Private Method to Update Auth Details in Async Storage
const updateUserAuthenticationDetailsInDB = (userAuthenticationDetails) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_ID', userAuthenticationDetails.userId);
      await AsyncStorage.setItem('USER_SECRET_KEY', userAuthenticationDetails.secret);
      return new Response(200, userAuthenticationDetails);
    } catch (err) {
      return new Response(500, null);
    };
  }
};

//Private Method to Fetch User Details from Async Storage
const fetchUserAuthDetails = () => {
  return async dispatch => {
    try {
      var userId = await AsyncStorage.getItem('USER_ID');
      var userSecretKey = await AsyncStorage.getItem('USER_SECRET_KEY');
      var userAuthDetails = new UserAuthenticationDetails(userId, userSecretKey);
      return new Response(200, userAuthDetails);
    } catch (err) {
      return new Response(500, null);
    };
  }
};

