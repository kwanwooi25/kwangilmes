import { LOGIN_USER, LOGOUT_USER } from '../actions/types';

const INITIAL_STATE = {
	isLoggedIn: false,
	userToken: '',
	current_user: null,
	error: ''
};

export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOGIN_USER:
			localStorage.setItem('usetToken', action.payload.userToken);
			return action.payload;
		case LOGOUT_USER:
			localStorage.removeItem('userToken');
			return INITIAL_STATE;
		default:
			return state;
	}
}
