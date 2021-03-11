import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import * as userActions from './user-actions';
import UserAuthenticationDetails from '../models/userAuthenticationDetails';

export const UPDATE_USER_AUTH_DETAILS = 'UPDATE_USER_AUTH_DETAILS';

//TODO MSISDN should be encrypted
export const generateOTPForMSISDN = (msisdn) => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });

      var URL = configData.SERVER_URL + "auth/getOTP/" + msisdn;
      fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
        .then((response) => {
          resolve(response);
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

export const validateOTPForMSISDN = (msisdn, otpCode) => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });

      var URL = configData.SERVER_URL + "auth/validateOTP/" + msisdn + "?otpCode=" + otpCode;
      fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
        .then((response) => {
          if (response.isValid === true) {
            dispatch(updateUserAuthenticationDetailsInDB(response));
            dispatch({
              type: UPDATE_USER_AUTH_DETAILS,
              authDetails: response
            });
          }
          resolve(response);
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

//Method to load User Auth Details from Async Storage and update state
export const loadUserAuthDetails = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      //Fetch Auth Details from Local DB
      dispatch(fetchUserAuthDetails()).then((response) => {
          if (response!==null&&response.userId!==null) {
            //Dispatch User Auth Details Update State
             dispatch({
              type: UPDATE_USER_AUTH_DETAILS,
              authDetails: response
            });
          } 
          resolve(response);
        })
        .catch(err => {
           resolve(null);
        });
    });
  }
};

//Private Method to Update Auth Details in Async Storage
const updateUserAuthenticationDetailsInDB = (userAuthenticationDetails) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_ID', userAuthenticationDetails.userId);
      await AsyncStorage.setItem('USER_SECRET_KEY', userAuthenticationDetails.secret);
    } catch (err) {

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
      return userAuthDetails;
    } catch (err) {
      return null;
    };
  }
};

