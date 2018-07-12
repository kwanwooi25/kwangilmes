import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../actions/types';

const INITIAL_STATE = {
  isSnackbarOpen: false,
  snackbarMessage: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return { isSnackbarOpen: true, snackbarMessage: action.payload };

    default:
      return INITIAL_STATE;
  }
}
