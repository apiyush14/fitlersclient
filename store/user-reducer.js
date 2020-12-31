import {
	UPDATE_USER_DETAILS
} from './user-actions';
import UserDetails from '../models/userDetails';

const initialState = {
	userDetails: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_USER_DETAILS:
			return new UserDetails(action.userDetails.userFirstName, action.userDetails.userLastName);

		default:
			return state;
	}
	return state;
};