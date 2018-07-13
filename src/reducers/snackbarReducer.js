import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../actions/types';

const INITIAL_STATE = {
  isSnackbarOpen: false,
  snackbarMessage: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return { isSnackbarOpen: true, snackbarMessage: action.payload };

    case HIDE_SNACKBAR:
      return INITIAL_STATE;

    default:
      return state;
  }
}
