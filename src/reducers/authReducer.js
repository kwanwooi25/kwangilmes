import { LOGIN_USER, LOGOUT_USER } from '../actions/types';

const INITIAL_STATE = {
	isLoggedIn: false,
	userToken: '',
	current_user: {},
	error: ''
};

export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOGIN_USER:
			return action.payload;
		case LOGOUT_USER:
			return INITIAL_STATE;
		default:
			return state;
	}
}
