import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import * as userActions from './user-actions';

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
          if(response.status&&response.newUser){
            dispatch(userActions.cleanUpUserData());
          }
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

const updateUserAuthenticationDetailsInDB = (userAuthenticationDetails) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_ID', userAuthenticationDetails.userId);
      await AsyncStorage.setItem('USER_SECRET_KEY', userAuthenticationDetails.secret);
    } catch (err) {

    };
  }
};

