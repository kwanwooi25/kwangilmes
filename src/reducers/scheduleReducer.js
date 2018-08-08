import {
  SET_SCHEDULE_PENDING,
  FETCH_DELIVERY_SCHEDULE
} from '../actions/types';
import moment from 'moment';

const INITIAL_STATE = {
  isPending: false,
  current: [],
  search: {
    year: moment().year(),
    month: moment().month()
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SCHEDULE_PENDING:
      return Object.assign({}, state, { isPending: true });

    case FETCH_DELIVERY_SCHEDULE:
      const { orders, search } = action.payload;
      return {
        isPending: false,
        current: orders,
        search
      };

    default:
      return state;
  }
}
