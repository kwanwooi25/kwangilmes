import { combineReducers } from 'redux';
import authReducer from './authReducer';
import snackbarReducer from './snackbarReducer';
import accountsReducer from './accountsReducer';
import productsReducer from './productsReducer';
import ordersReducer from './ordersReducer';

export default combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  accounts: accountsReducer,
  products: productsReducer,
  orders: ordersReducer
});
