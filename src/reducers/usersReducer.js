import { SET_USERS_PENDING, FETCH_USERS } from '../actions/types';

const INITIAL_STATE = {
	isPending: false,
	count: 0,
	all: []
};

export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_USERS_PENDING:
			return Object.assign({}, state, { isPending: true });

		case FETCH_USERS:
			const users = action.payload;
			return Object.assign({}, state, {
				isPending: false,
				count: users.length,
				all: users
			});

		default:
			return state;
	}
}
