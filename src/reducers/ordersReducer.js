// import {
//   ADD_ORDER
// } from '../actions/types';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  current: [],
  selected: [],
  selectedOrder: {},
  // search: {
  //   account_name: '',
  //   product_name: '',
  //   product_thick: '',
  //   product_length: '',
  //   product_width: '',
  //   ext_color: '',
  //   print_color: '',
  //   limit: 10,
  //   offset: 0
  // }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    // case FETCH_PRODUCTS:
    //   const { count, products, ids, search } = action.payload;
    //   products.forEach(product => {
    //     product.checked = state.selected.includes(product.id);
    //   });
    //   return Object.assign({}, state, {
    //     isPending: false,
    //     count: Number(count),
    //     all: ids,
    //     current: products,
    //     search
    //   });
    //
    // case TOGGLE_PRODUCT_CHECKED:
    //   const id = action.payload;
    //   state.current.forEach(product => {
    //     if (product.id === id) {
    //       product.checked = !product.checked;
    //       if (product.checked) {
    //         state.selected.push(product.id);
    //       } else {
    //         state.selected.splice(state.selected.indexOf(product.id), 1);
    //       }
    //     }
    //   });
    //   return { current: state.current, selected: state.selected, ...state };
    //
    // case SET_PRODUCTS_CHECKED:
    //   state.selected = [];
    //   state.selected = state.selected.concat(state.all);
    //   state.current.forEach(product => {
    //     product.checked = true;
    //   });
    //   return { current: state.current, selected: state.selected, ...state };
    //
    // case SET_PRODUCTS_UNCHECKED:
    //   state.selected = [];
    //   state.current.forEach(product => {
    //     product.checked = false;
    //   });
    //   return { current: state.current, selected: state.selected, ...state };
    //
    // case DELETE_PRODUCTS:
    //   state.selected = state.selected.filter(id => !action.payload.includes(id));
    //   return { selected: state.selected, ...state };

    default:
      return state;
  }
}
