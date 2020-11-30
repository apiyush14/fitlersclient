import {UPDATE_USER_AUTH_DETAILS} from './auth-actions';
import UserAuthenticationDetails from '../models/userAuthenticationDetails';

const initialState={
	authDetails:{}
};

export default (state=initialState, action)=>{
	switch(action.type) {
        case UPDATE_USER_AUTH_DETAILS:
        return new UserAuthenticationDetails(action.authDetails.userId,action.authDetails.secret);

		default:
		return state;
	}
	return state;
};