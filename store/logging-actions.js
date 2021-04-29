import NetInfo from '@react-native-community/netinfo';
import configData from "../config/config.json";
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import {AsyncStorage} from 'react-native';
import StatusCodes from "../utils/StatusCodes.json";

//Method to send the error logs to server
export const sendErrorLogsToServer = (exceptionDetails) => {
	return async dispatch => {
		var userId = await AsyncStorage.getItem('USER_ID');

		var networkStatus = await NetInfo.fetch().then(state => {
			if (!state.isConnected) {
				return new Response(StatusCodes.NO_INTERNET, null);
			}
		});
		if (networkStatus) {
			return networkStatus;
		}

		var URL = configData.SERVER_URL + "log/client/" + userId;
		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				stackTrace: exceptionDetails.stackTrace,
				errorMessage: exceptionDetails.errorMessage
			})
		}).then().catch(err => {

		});
	}
};