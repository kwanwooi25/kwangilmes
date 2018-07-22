import {
  FETCH_ORDERS,
  TOGGLE_ORDER_CHECKED,
  SET_ORDERS_CHECKED,
  SET_ORDERS_UNCHECKED
} from '../actions/types';
import moment from 'moment';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  current: [],
  selected: [],
  selectedOrder: {},
  search: {
    date_from: moment()
      .subtract(14, 'days')
      .format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
    account_name: '',
    product_name: '',
    product_thick: '',
    product_length: '',
    product_width: '',
    show_completed: false,
    limit: 10,
    offset: 0
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    case FETCH_ORDERS:
      const { count, orders, ids, search } = action.payload;
      orders.forEach(order => {
        order.checked = state.selected.includes(order.id);
      });
      return Object.assign({}, state, {
        isPending: false,
        count: Number(count),
        all: ids,
        current: orders,
        search
      });

    case TOGGLE_ORDER_CHECKED:
      const id = action.payload;
      state.current.forEach(order => {
        if (order.id === id) {
          order.checked = !order.checked;
          if (order.checked) {
            state.selected.push(order.id);
          } else {
            state.selected.splice(state.selected.indexOf(order.id), 1);
          }
        }
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_ORDERS_CHECKED:
      state.selected = [];
      state.selected = state.selected.concat(state.all);
      state.current.forEach(order => {
        order.checked = true;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_ORDERS_UNCHECKED:
      state.selected = [];
      state.current.forEach(order => {
        order.checked = false;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    // case DELETE_PRODUCTS:
    //   state.selected = state.selected.filter(id => !action.payload.includes(id));
    //   return { selected: state.selected, ...state };

    default:
      return state;
  }
}
