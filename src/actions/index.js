import {
  LOGIN_USER,
  LOGOUT_USER,
  SET_USERS_PENDING,
  FETCH_USERS,
  SET_ACCOUNTS_PENDING,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_NAMES,
  DELETE_ACCOUNTS,
  TOGGLE_ACCOUNT_CHECKED,
  SET_ACCOUNTS_CHECKED,
  SET_ACCOUNTS_UNCHECKED,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
  SET_PRODUCTS_PENDING,
  FETCH_PRODUCTS,
  DELETE_PRODUCTS,
  TOGGLE_PRODUCT_CHECKED,
  SET_PRODUCTS_CHECKED,
  SET_PRODUCTS_UNCHECKED,
  SET_PLATES_PENDING,
  FETCH_PLATES,
  DELETE_PLATES,
  TOGGLE_PLATE_CHECKED,
  SET_PLATES_CHECKED,
  SET_PLATES_UNCHECKED,
  SET_ORDERS_PENDING,
  FETCH_ORDERS,
  DELETE_ORDERS,
  TOGGLE_ORDER_CHECKED,
  SET_ORDERS_CHECKED,
  SET_ORDERS_UNCHECKED,
  SET_SCHEDULE_PENDING,
  FETCH_DELIVERY_SCHEDULE,
  FETCH_ORDERS_NEED_PLATE
} from './types';

const HOST = process.env.REACT_APP_API_HOST;

export const loginUser = (username, password) => dispatch => {
  fetch(`${HOST}/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      if (success) {
        const payload = {
          isLoggedIn: success,
          userToken: data.token,
          current_user: data.user,
          error
        };
        dispatch({ type: LOGIN_USER, payload });
      }
    });
};

export const getCurrentUser = (token) => dispatch => {
  fetch(`${HOST}/current_user?token=${token}`)
    .then(response => response.json())
    .then(({ success, error, data }) => {
      if (success) {
        const payload = {
          isLoggedIn: success,
          userToken: token,
          current_user: data.user,
          error
        }
        dispatch({ type: LOGIN_USER, payload });
      }
    })
}

export const logoutUser = () => dispatch => {
  dispatch({ type: LOGOUT_USER });
};

export const fetchUsers = userToken => dispatch => {
  dispatch({ type: SET_USERS_PENDING });
  fetch(`${HOST}/users`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'get'
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      dispatch({ type: FETCH_USERS, payload: data });
    });
};

export const registerUser = (userToken, user) => dispatch => {
  fetch(`${HOST}/register`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        Promise.resolve(dispatch(fetchUsers(userToken))).then(() => {
          dispatch(showSnackbar(`사용자 (${user.display_name}) 등록완료`));
        });
      }
    });
};

export const updateUser = (userToken, data) => dispatch => {
  fetch(`${HOST}/users/${data.username}`, {
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
        Promise.resolve(dispatch(fetchUsers(userToken))).then(() => {
          dispatch(showSnackbar('사용자 정보 수정 완료'));
        });
      }
    });
};

export const changeUserPassword = (userToken, data) => dispatch => {
  fetch(`${HOST}/users_password/${data.username}`, {
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
        Promise.resolve(dispatch(fetchUsers(userToken))).then(() => {
          dispatch(showSnackbar('비밀번호 변경 완료'));
        });
      }
    });
};

export const deleteUser = (userToken, username) => dispatch => {
  fetch(`${HOST}/users/${username}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'delete'
  })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        Promise.resolve(dispatch(fetchUsers(userToken))).then(() => {
          dispatch(showSnackbar('사용자 삭제 완료'));
        });
      }
    });
};

export const fetchAccounts = (userToken, search) => dispatch => {
  dispatch({ type: SET_ACCOUNTS_PENDING });
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
};

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
  dispatch({ type: SET_PRODUCTS_PENDING });
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
};

export const toggleProductChecked = id => dispatch => {
  dispatch({ type: TOGGLE_PRODUCT_CHECKED, payload: id });
};

export const toggleProductsChecked = checked => dispatch => {
  if (checked) dispatch({ type: SET_PRODUCTS_CHECKED });
  else dispatch({ type: SET_PRODUCTS_UNCHECKED });
};

export const addProducts = (userToken, products, search) => dispatch => {
  dispatch({ type: SET_PRODUCTS_PENDING });

  let splitProducts = [];
  for (let i = 0; i < products.length; i += 1) {
    splitProducts.push(products.slice(i, i + 1));
  }

  Promise.all(
    splitProducts.map(chunk => {
      return fetch(`${HOST}/products/add`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': userToken
        },
        method: 'post',
        body: JSON.stringify(chunk)
      })
        .then(response => response.json())
        .then(({ success }) => success);
    })
  ).then(results => {
    const count = results.filter(value => value === true).length;
    Promise.resolve(dispatch(fetchProducts(userToken, search))).then(() => {
      dispatch(showSnackbar(`${count}개 품목 엑셀 등록 완료`));
    });
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

export const fetchPlates = (userToken, search) => dispatch => {
  dispatch({ type: SET_PLATES_PENDING });
  fetch(`${HOST}/plates`, {
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
        dispatch({ type: FETCH_PLATES, payload: data });
      }
    });
};

export const deletePlates = (userToken, ids, search) => dispatch => {
  fetch(`${HOST}/plates/`, {
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
        Promise.resolve(dispatch(fetchPlates(userToken, search))).then(() => {
          dispatch(showSnackbar('동판 삭제 완료'));
          dispatch({ type: DELETE_PLATES, payload: ids });
        });
      }
    });
};

export const addPlates = (userToken, plates, search) => dispatch => {
  dispatch({ type: SET_PLATES_PENDING });

  let splitPlates = [];
  for (let i = 0; i < plates.length; i += 1) {
    splitPlates.push(plates.slice(i, i + 1));
  }

  Promise.all(
    splitPlates.map(chunk => {
      return fetch(`${HOST}/plates/add`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': userToken
        },
        method: 'post',
        body: JSON.stringify(chunk)
      })
        .then(response => response.json())
        .then(({ success }) => success);
    })
  ).then(results => {
    const count = results.filter(value => value === true).length;
    Promise.resolve(dispatch(fetchPlates(userToken, search))).then(() => {
      dispatch(showSnackbar(`${count}개 동판 등록 완료`));
    });
  });
};

export const updatePlate = (userToken, plateId, data, search) => dispatch => {
  fetch(`${HOST}/plates/${plateId}`, {
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
        Promise.resolve(dispatch(fetchPlates(userToken, search))).then(() => {
          dispatch(showSnackbar('동판 수정 완료'));
        });
      }
    });
};

export const togglePlateChecked = id => dispatch => {
  dispatch({ type: TOGGLE_PLATE_CHECKED, payload: id });
};

export const togglePlatesChecked = checked => dispatch => {
  if (checked) dispatch({ type: SET_PLATES_CHECKED });
  else dispatch({ type: SET_PLATES_UNCHECKED });
};

export const fetchOrders = (userToken, search) => dispatch => {
  dispatch({ type: SET_ORDERS_PENDING });
  fetch(`${HOST}/orders`, {
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
        dispatch({ type: FETCH_ORDERS, payload: data });
      }
    });
};

export const addOrder = (userToken, order, search) => dispatch => {
  fetch(`${HOST}/orders/add`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'post',
    body: JSON.stringify(order)
  })
    .then(response => response.json())
    .then(({ success, data }) => {
      if (success) {
        dispatch(showSnackbar(`작업지시 완료`));
      }
    });
};

export const updateOrder = (userToken, orderId, data, search) => dispatch => {
  fetch(`${HOST}/orders/${orderId}`, {
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
        Promise.resolve(dispatch(fetchOrders(userToken, search))).then(() => {
          dispatch(showSnackbar('작업지시 수정 완료'));
        });
      }
    });
};

export const deleteOrders = (userToken, ids, search) => dispatch => {
  fetch(`${HOST}/orders/`, {
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
        Promise.resolve(dispatch(fetchOrders(userToken, search))).then(() => {
          dispatch(showSnackbar('주문 취소 완료'));
          dispatch({ type: DELETE_ORDERS, payload: ids });
        });
      }
    });
};

export const completeOrders = (userToken, data, search) => dispatch => {
  fetch(`${HOST}/orders-complete`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'put',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      if (success) {
        Promise.resolve(dispatch(fetchOrders(userToken, search))).then(() => {
          dispatch({ type: SET_ORDERS_UNCHECKED });
          dispatch(showSnackbar(`${data.length}건 작업 완료`));
        });
      }
    });
};

export const toggleOrderChecked = id => dispatch => {
  dispatch({ type: TOGGLE_ORDER_CHECKED, payload: id });
};

export const toggleOrdersChecked = checked => dispatch => {
  if (checked) dispatch({ type: SET_ORDERS_CHECKED });
  else dispatch({ type: SET_ORDERS_UNCHECKED });
};

export const fetchDeliverySchedule = (userToken, search) => dispatch => {
  dispatch({ type: SET_SCHEDULE_PENDING });
  fetch(`${HOST}/orders-delivery-schedule`, {
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
        dispatch({ type: FETCH_DELIVERY_SCHEDULE, payload: data });
      }
    });
};

export const fetchOrdersNeedPlate = userToken => dispatch => {
  dispatch({ type: SET_ORDERS_PENDING });
  fetch(`${HOST}/orders-need-plate`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': userToken
    },
    method: 'get'
  })
    .then(response => response.json())
    .then(({ success, error, data }) => {
      if (success) dispatch({ type: FETCH_ORDERS_NEED_PLATE, payload: data });
    });
};

export const updatePlateStatus = (
  userToken,
  orderId,
  data,
  search
) => dispatch => {
  fetch(`${HOST}/orders/${orderId}`, {
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
        Promise.resolve(dispatch(fetchOrdersNeedPlate(userToken))).then(() => {
          dispatch(showSnackbar('동판상태 수정 완료'));
        });
      }
    });
};
