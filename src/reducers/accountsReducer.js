import {
  FETCH_ACCOUNTS,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED,
  SET_ACCOUNTS_UNCHECKED,
  DELETE_ACCOUNTS
} from '../actions/types';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  current: [],
  selected: [],
  search: {
    account_name: '',
    limit: 10,
    offset: 0
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    case FETCH_ACCOUNTS:
      const { count, accounts, ids, search } = action.payload;
      accounts.forEach(account => {
        account.checked = state.selected.includes(account.id);
      });
      return {
        isPending: false,
        count: Number(count),
        all: ids,
        current: accounts,
        search,
        selected: state.selected
      };

    case TOGGLE_ACCOUNT_CHECKED:
      const id = action.payload;
      state.current.forEach(account => {
        if (account.id === id) {
          account.checked = !account.checked;
          if (account.checked) {
            state.selected.push(account.id);
          } else {
            state.selected.splice(state.selected.indexOf(account.id), 1);
          }
        }
      });
      return { current: state.current, selected: state.selected, ...state };

    case SET_ACCOUNTS_CHECKED:
      state.selected = [];
      state.selected = state.selected.concat(state.all);
      state.current.forEach(account => {
        account.checked = true;
      });
      return { current: state.current, selected: state.selected, ...state };

    case SET_ACCOUNTS_UNCHECKED:
      state.selected = [];
      state.current.forEach(account => {
        account.checked = false;
      });
      return { current: state.current, selected: state.selected, ...state };

    default:
      return state;
  }
}
