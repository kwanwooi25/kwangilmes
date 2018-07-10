import { LOGIN_USER, LOGOUT_USER, FETCH_ACCOUNTS } from './types';

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
