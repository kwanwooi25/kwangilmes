import {
  LOGIN_USER,
  LOGOUT_USER,
  FETCH_ACCOUNTS
} from './types';
import { auth } from '../reducers';

const HOST = 'http://api.kwangilmes.com';

export const loginUser = (username, password) => dispatch => {
  fetch(`${HOST}/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (response.status === 401) {
        return {
          isLoggedIn: false,
          user: {},
          error: true,
          errorMessage: '아이디와 비밀번호를 확인하세요.'
        };
      } else {
        return response.json().then(user => ({
          isLoggedIn: true,
          user,
          error: false,
          errorMessage: ''
        }));
      }
    })
    .then(payload => dispatch({ type: LOGIN_USER, payload }));
};

export const logoutUser = () => dispatch => {
  dispatch({ type: LOGOUT_USER });
};

export const fetchAccounts = (user, searchTerm) => dispatch => {
  console.log(user);
  fetch(`${HOST}/accounts`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ searchTerm }),
    user
  })
    .then(response => response.json())
    .then(console.log);
}
