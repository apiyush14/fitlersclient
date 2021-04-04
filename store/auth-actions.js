import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import StatusCodes from "../utils/StatusCodes.json";
import * as userActions from './user-actions';
import Response from '../models/response';
import UserAuthenticationDetails from '../models/userAuthenticationDetails';
import ExceptionDetails from '../models/exceptionDetails';
import * as loggingActions from '../store/logging-actions';

export const UPDATE_USER_AUTH_DETAILS = 'UPDATE_USER_AUTH_DETAILS';
export const CLEAN_AUTH_STATE = 'CLEAN_AUTH_STATE';

//Method to load User Auth Details from Async Storage and update state
export const loadUserAuthDetails = () => {
  return async dispatch => {
    //Sync Fetch Auth Details from Local DB
    return dispatch(fetchUserAuthDetails()).then((response) => {
        if (response.status >= StatusCodes.BAD_REQUEST) {
          return new Response(response.status, null);
        } else if (response.data.userId !== null) {
          //Async Dispatch User Auth Details Update State
          dispatch({
            type: UPDATE_USER_AUTH_DETAILS,
            authDetails: response.data
          });
        }
        return new Response(StatusCodes.OK, response.data);
      })
      .catch(err => {
        dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
        return new Response(StatusCodes.INTERNAL_SERVER_ERROR, null);
      });
  }
};

//TODO MSISDN should be encrypted
//Generate OTP for MSISDN Sync Action
export const generateOTPForMSISDN = (msisdn) => {
  return async dispatch => {
    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(StatusCodes.NO_INTERNET, null);
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
        if (response.status >= StatusCodes.BAD_REQUEST) {
          return new Response(response.status, null);
        } else {
          return new Response(StatusCodes.OK, response);
        }
      }).catch(err => {
        dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
        return new Response(StatusCodes.INTERNAL_SERVER_ERROR, null);
      });
  }
};

//Sync Method to Validate entered OTP and update state and hydrate local DB
export const validateOTPForMSISDN = (msisdn, otpCode) => {
  return async dispatch => {
    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(StatusCodes.NO_INTERNET, null);
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
        if (response.status >= StatusCodes.BAD_REQUEST) {
          return new Response(response.status, null);
        } else if (response.isValid === true) {
          //Async dispatch to update state for Auth Details
          dispatch({
            type: UPDATE_USER_AUTH_DETAILS,
            authDetails: response
          });
          //Sync dispatch to update Auth Details in Async Storage
          return dispatch(updateUserAuthenticationDetailsInDB(response)).then((response) => {
            if (response.status >= StatusCodes.BAD_REQUEST) {
              return new Response(response.status, null);
            } else {
              return new Response(StatusCodes.OK, response.data);
            }
          });
        } else {
          return new Response(StatusCodes.OK, response);
        }
      }).catch(err => {
        dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
        return new Response(StatusCodes.INTERNAL_SERVER_ERROR, null);
      });
  }
};

//Private Method to Update Auth Details in Async Storage
const updateUserAuthenticationDetailsInDB = (userAuthenticationDetails) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_ID', userAuthenticationDetails.userId);
      await AsyncStorage.setItem('USER_SECRET_KEY', userAuthenticationDetails.secret);
      return new Response(StatusCodes.OK, userAuthenticationDetails);
    } catch (err) {
      dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
      return new Response(StatusCodes.INTERNAL_SERVER_ERROR, null);
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
      return new Response(StatusCodes.OK, userAuthDetails);
    } catch (err) {
      dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
      return new Response(StatusCodes.INTERNAL_SERVER_ERROR, null);
    };
  }
};