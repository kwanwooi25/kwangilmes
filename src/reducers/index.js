import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snackbarReducer from './snackbarReducer';
import accountsReducer from './accountsReducer';

export default combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  accounts: accountsReducer
});
