import {
  LOGIN_USER,
  LOGOUT_USER,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_NAMES,
  DELETE_ACCOUNTS,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED,
  SET_ACCOUNTS_UNCHECKED,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  FETCH_PRODUCTS,
  DELETE_PRODUCTS,
  TOGGLE_PRODUCT_CHECKED,
  SET_PRODUCTS_CHECKED,
  SET_PRODUCTS_UNCHECKED
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

export const fetchAccount = (userToken, accountId) => dispatch => {
  fetch(`${HOST}/accounts/${accountId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'get'
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      dispatch({ type: FETCH_ACCOUNT, payload: data });
    });
};

export const fetchAccountNames = userToken => dispatch => {
  fetch(`${HOST}/accounts`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'get'
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      if (success) dispatch({ type: FETCH_ACCOUNT_NAMES, payload: data });
    });
}

export const updateAccount = (
  userToken,
  accountId,
  data,
  search
) => dispatch => {
  fetch(`${HOST}/accounts/${accountId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'put',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        Promise.resolve(dispatch(fetchAccounts(userToken, search))).then(() => {
          dispatch(showSnackbar('업체 수정 완료'));
        });
      }
    });
};

export const toggleAccountChecked = id => dispatch => {
  dispatch({ type: TOGGLE_ACCOUNT_CHECKED, payload: id });
};

export const toggleAccountsChecked = checked => dispatch => {
  if (checked) dispatch({ type: SET_ACCOUNTS_CHECKED });
  else dispatch({ type: SET_ACCOUNTS_UNCHECKED });
};

export const addAccounts = (userToken, accounts, search) => dispatch => {
  fetch(`${HOST}/accounts/add`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(accounts)
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      if (success) {
        Promise.resolve(dispatch(fetchAccounts(userToken, search))).then(() => {
          dispatch(showSnackbar(`${data.length}개 업체 등록 완료`));
        });
      }
    });
};

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
    .then(({ success, data }) => {
      if (success) {
        Promise.resolve(dispatch(fetchAccounts(userToken, search))).then(() => {
          dispatch(showSnackbar('업체 삭제 완료'));
          dispatch({ type: DELETE_ACCOUNTS, payload: ids });
        });
      }
    });
};

export const showSnackbar = message => dispatch => {
  dispatch({ type: SHOW_SNACKBAR, payload: message });
  setTimeout(() => {
    dispatch({ type: HIDE_SNACKBAR });
  }, 3000);
};

export const fetchProducts = (userToken, search) => dispatch => {
  fetch(`${HOST}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(search)
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      if (success) {
        data.search = search;
        dispatch({ type: FETCH_PRODUCTS, payload: data });
      }
    });
}

export const toggleProductChecked = id => dispatch => {
  dispatch({ type: TOGGLE_PRODUCT_CHECKED, payload: id });
};

export const toggleProductsChecked = checked => dispatch => {
  if (checked) dispatch({ type: SET_PRODUCTS_CHECKED });
  else dispatch({ type: SET_PRODUCTS_UNCHECKED });
};

export const addProducts = (userToken, products, search) => dispatch => {
  fetch(`${HOST}/products/add`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(products)
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      if (success) {
        Promise.resolve(dispatch(fetchProducts(userToken, search))).then(() => {
          dispatch(showSnackbar(`${data.length}개 품목 등록 완료`));
        });
      }
    });
};

export const updateProduct = (
  userToken,
  productId,
  data,
  search
) => dispatch => {
  fetch(`${HOST}/products/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'put',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        Promise.resolve(dispatch(fetchProducts(userToken, search))).then(() => {
          dispatch(showSnackbar('품목 수정 완료'));
        });
      }
    });
};

export const deleteProducts = (userToken, ids, search) => dispatch => {
  fetch(`${HOST}/products/`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'delete',
    body: JSON.stringify(ids)
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      if (success) {
        Promise.resolve(dispatch(fetchProducts(userToken, search))).then(() => {
          dispatch(showSnackbar('업체 삭제 완료'));
          dispatch({ type: DELETE_PRODUCTS, payload: ids });
        });
      }
    });
};
