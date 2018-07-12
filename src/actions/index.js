import {
  LOGIN_USER,
  LOGOUT_USER,
  FETCH_ACCOUNTS,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED,
  SET_ACCOUNTS_UNCHECKED
} from './types';

// const HOST = 'http://api.kwangilmes.com';
const HOST = 'http://localhost:3000';

export const loginUser = (username, password) => dispatch => {
  fetch(`${HOST}/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      const payload = { isLoggedIn: success, userToken: data, error };
      dispatch({ type: LOGIN_USER, payload });
    });
};

export const logoutUser = () => dispatch => {
  dispatch({ type: LOGOUT_USER });
};

export const fetchAccounts = (userToken, search) => dispatch => {
  fetch(`${HOST}/accounts`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(search)
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      data.search = search;
      dispatch({ type: FETCH_ACCOUNTS, payload: data });
    });
};

export const toggleAccountChecked = id => dispatch => {
  dispatch({ type: TOGGLE_ACCOUNT_CHECKED, payload: id });
};

export const toggleAccountsChecked = (checked) => dispatch => {
  if (checked) dispatch ({ type: SET_ACCOUNTS_CHECKED });
  else dispatch ({ type: SET_ACCOUNTS_UNCHECKED });
}

export const deleteAccounts = (userToken, ids, search) => dispatch => {
  fetch(`${HOST}/accounts/`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'delete',
    body: JSON.stringify(ids)
  })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        fetch(`${HOST}/accounts`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': userToken
          },
          method: 'post',
          body: JSON.stringify(search)
        })
          .then(response => response.json())
          .then(({ success, error, data }) => {
            data.search = search;
            dispatch({ type: FETCH_ACCOUNTS, payload: data });
          });
      }
    })
}
