import {
  FETCH_ACCOUNTS
} from '../actions/types';

const INITIAL_STATE = {
  currentPage: 1,
  totalCount: 0,
  list: [],
  search: {
    searchTerm: '',
    limit: 10,
    offset: 0,
  }
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      const { count, accounts, search } = action.payload;
      return { totalCount: count, list: accounts, search };
    default:
      return state;
  }
}
