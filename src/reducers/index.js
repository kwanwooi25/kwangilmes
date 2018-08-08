import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snackbarReducer from './snackbarReducer';
import accountsReducer from './accountsReducer';
import productsReducer from './productsReducer';
import platesReducer from './platesReducer';
import ordersReducer from './ordersReducer';
import scheduleReducer from './scheduleReducer';

export default combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  accounts: accountsReducer,
  products: productsReducer,
  plates: platesReducer,
  orders: ordersReducer,
  schedule: scheduleReducer
});
