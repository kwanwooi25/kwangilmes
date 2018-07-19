import {
  FETCH_PLATES,
  TOGGLE_PLATE_CHECKED,
  SET_PLATES_CHECKED,
  SET_PLATES_UNCHECKED
} from '../actions/types';

const INITIAL_STATE = {
  isPending: false,
  count: 0,
  all: [],
  current: [],
  selected: [],
  selectedPlate: {},
  search: {
    plate_round: '',
    plate_length: '',
    plate_material: '',
    product_name: '',
    limit: 10,
    offset: 0
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    case FETCH_PLATES:
      const { count, plates, ids, search } = action.payload;
      plates.forEach(plate => {
        plate.checked = state.selected.includes(plate.id);
      });
      return Object.assign({}, state, {
        isPending: false,
        count: Number(count),
        all: ids,
        current: plates,
        search
      });

    case TOGGLE_PLATE_CHECKED:
      const id = action.payload;
      state.current.forEach(plate => {
        if (plate.id === id) {
          plate.checked = !plate.checked;
          if (plate.checked) {
            state.selected.push(plate.id);
          } else {
            state.selected.splice(state.selected.indexOf(plate.id), 1);
          }
        }
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_PLATES_CHECKED:
      state.selected = [];
      state.selected = state.selected.concat(state.all);
      state.current.forEach(plate => {
        plate.checked = true;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    case SET_PLATES_UNCHECKED:
      state.selected = [];
      state.current.forEach(plate => {
        plate.checked = false;
      });
      return Object.assign({}, state, { current: state.current, selected: state.selected });

    // case DELETE_PLATES:
    //   state.selected = state.selected.filter(id => !action.payload.includes(id));
    //   return { selected: state.selected, ...state };

    default:
      return state;
  }
}
