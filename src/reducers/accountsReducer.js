import {
  FETCH_ACCOUNTS,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_NAMES,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED,
  SET_ACCOUNTS_UNCHECKED,
  DELETE_ACCOUNTS
} from '../actions/types';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  names: [],
  current: [],
  selected: [],
  selectedAccount: {},
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
      return Object.assign({}, state, {
        isPending: false,
        count: Number(count),
        all: ids,
        current: accounts,
        search
      });

    case FETCH_ACCOUNT:
      return Object.assign({}, state, { selectedAccount: action.payload });

    case FETCH_ACCOUNT_NAMES:
      return Object.assign({}, state, { names: action.payload });

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
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_ACCOUNTS_CHECKED:
      state.selected = [];
      state.selected = state.selected.concat(state.all);
      state.current.forEach(account => {
        account.checked = true;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_ACCOUNTS_UNCHECKED:
      state.selected = [];
      state.current.forEach(account => {
        account.checked = false;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case DELETE_ACCOUNTS:
      state.selected = state.selected.filter(id => !action.payload.includes(id));
      return Object.assign({}, state, { selected: state.selected });

    default:
      return state;
  }
}
