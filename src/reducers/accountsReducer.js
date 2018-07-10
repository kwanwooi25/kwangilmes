import {
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_RESPONSE,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED
} from '../actions/types';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  selected: [],
  search: {
    account_name: '',
    limit: 10,
    offset: 0
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ACCOUNTS_REQUEST:
      state.isPending = true;
      return state;
    case FETCH_ACCOUNTS_RESPONSE:
      const { count, accounts, search } = action.payload;
      return {
        isPending: false,
        count: Number(count),
        all: accounts,
        search,
        selected: state.selected
      };
    case TOGGLE_ACCOUNT_CHECKED:
      const id = action.payload;
      const updated = state.all.map(account => {
        if (account.id === id) account.checked = !account.checked;
      });
      return { all: updated, ...state };
    case SET_ACCOUNTS_CHECKED:
      const checked = action.payload;
      const updatedAll = state.all.map(account => {
        account.checked = checked;
      });
      return { all: updatedAll, ...state };
    default:
      return state;
  }
}
