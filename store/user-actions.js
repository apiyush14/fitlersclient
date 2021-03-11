import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import UserDetails from '../models/userDetails';
import {cleanUpAllData} from '../utils/DBUtils';

export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';

//Method to Load User Details first from local DB, and then from server in case needed and hydrate local DB
export const loadUserDetails = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      //Fetch User Details from Local DB
      dispatch(fetchUserDetails()).then((response) => {
         console.log('=============Load User Details==================');
         console.log(response);
          if (response.userFirstName!==null) {
            console.log('=============Load User Details from Local Completed==================');
            
            //Dispatch User Details Update State
            dispatch({
            type: UPDATE_USER_DETAILS,
            userDetails: response
          });
          } else {
            //Dispatch Load User Details from Server Action
            console.log('=============Load User Details From Server==================');
            dispatch(loadUserDetailsFromServer()).then((response) => {
              console.log('=============Load User Details From Server Response==================');
              console.log(response);
              if (response.userFirstName!== null) {
                  //Hydrate Local DB
                  dispatch(updateUserDetailsInDB(response.userFirstName,response.userLastName,response.userHeight,response.userWeight));
              }
              resolve(response);
            });
          }
          resolve(response);
        })
        .catch(err => {
           console.log('===============Exception=================');
           console.log(err);
        });
    });
  }
};

//Load User Details from Local DB or from server
export const loadUserDetailsFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          //reject(201);
        }
      });

      var URL = configData.SERVER_URL + "user/getDetails/" + userId;
      fetch(URL, {
          method: 'GET',
          headers: header
        }).then(response => response.json())
        .then((response) => {
          console.log('=============Load User Details From Server Response==================');
          console.log(response);
          if (response.userDetails!==null&&response.userDetails.userFirstName!==null) {
            //Dispatch User Details Update State
            dispatch({
              type: UPDATE_USER_DETAILS,
              userDetails: response.userDetails
            });
          }
          resolve(response.userDetails);
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

//TODO Names should be encrypted
export const updateUserDetails = (firstName,lastName,height,weight) => {
  console.log('======Update User Details=========');
  console.log(height);
  console.log(weight);
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
        userLastName: lastName,
        userHeight: height,
        userWeight: weight
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
            dispatch(updateUserDetailsInDB(firstName,lastName,height,weight));
            dispatch({
              type: UPDATE_USER_DETAILS,
              userDetails: userDetails
            });
          }
          resolve(response);
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

//Private Method to load User Details from Async Storage
const fetchUserDetails = () => {
  return async dispatch => {
    try {
      var userFirstName=await AsyncStorage.getItem('USER_FIRST_NAME');
      var userLastName=await AsyncStorage.getItem('USER_LAST_NAME');
      var userHeight=await AsyncStorage.getItem('USER_HEIGHT');
      var userWeight=await AsyncStorage.getItem('USER_WEIGHT');
      var userDetails=new UserDetails(userFirstName, userLastName, userHeight, userWeight);
      return userDetails;
    } catch (err) {

    };
  }
};

const updateUserDetailsInDB = (firstName,lastName,height,weight) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem('USER_FIRST_NAME', firstName);
      await AsyncStorage.setItem('USER_LAST_NAME', lastName);
      await AsyncStorage.setItem('USER_HEIGHT', height.toString());
      await AsyncStorage.setItem('USER_WEIGHT', weight.toString());
    } catch (err) {

    };
  }
};

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