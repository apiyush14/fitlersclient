import {UPDATE_USER_AUTH_DETAILS, CLEAN_AUTH_STATE} from './auth-actions';
import UserAuthenticationDetails from '../models/userAuthenticationDetails';

const initialState = {
	authDetails: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_USER_AUTH_DETAILS:
			return new UserAuthenticationDetails(action.authDetails.userId, action.authDetails.userSecretKey);

		case CLEAN_AUTH_STATE:
			return new UserAuthenticationDetails(null, null);

		default:
			return state;
	}
	return state;
};