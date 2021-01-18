import NetInfo from '@react-native-community/netinfo';
import {
  AsyncStorage
} from 'react-native';
import configData from "../config/config.json";
import {
  getUserAuthenticationToken
} from '../utils/AuthenticationUtils';

export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';

//TODO Names should be encrypted
export const updateUserDetails = (firstName,lastName) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
        }
      });

      var userDetails={
        userFirstName: firstName,
        userLastName: lastName
      }

      var URL = configData.SERVER_URL + "user/updateDetails/" + userId;
      fetch(URL, {
          method: 'PUT',
          headers: header,
          body: JSON.stringify({
            userDetails: userDetails
          })
        }).then(response => response.json())
        .then((response) => {
          if (response === true) {
            dispatch(updateUserDetailsInDB(firstName,lastName));
            dispatch({
              type: UPDATE_USER_DETAILS,
              userDetails: userDetails
            });
          }
          resolve(response);
        }).catch(err => {
          reject(err);
        });
    });
  }
};

const updateUserDetailsInDB = (firstName,lastName) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_NAME', firstName+" "+lastName);
    } catch (err) {

    };
  }
};