export const RENTAL_ACTIONS = {
  SET_RENTALS: 'SET_RENTALS',
  SET_RENTAL: 'SET_RENTAL',
  SET_SELECTED_RENTAL_ID: 'SET_SELECTED_RENTAL_ID',
  ADD_RENTAL: 'ADD_RENTAL',
  UPDATE_RENTAL: 'UPDATE_RENTAL',
  DELETE_RENTAL: 'DELETE_RENTAL',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_TOTAL_RENTALS: 'SET_TOTAL_RENTALS',
};

export const rentalsInitialState = {
  rentals: [],
  rental: {},
  selectedRentalId: null,
  filters: {
    search: '',
    status: 'ALL',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  totalRentals: 0,
};

const rentalReducer = (state, action) => {
  switch (action.type) {
    case RENTAL_ACTIONS.SET_RENTALS:
      return {
        ...state,
        rentals: action.payload,
      };
    case RENTAL_ACTIONS.SET_RENTAL:
      return {
        ...state,
        rental: action.payload,
      };
    case RENTAL_ACTIONS.SET_SELECTED_RENTAL_ID:
      return {
        ...state,
        selectedRentalId: action.payload,
      };
    case RENTAL_ACTIONS.ADD_RENTAL:
      return {
        ...state,
        rentals: [...state.rentals, action.payload],
      };
    case RENTAL_ACTIONS.UPDATE_RENTAL:
      return {
        ...state,
        rentals: state.rentals.map((rental) =>
          rental.id === action.payload.id ? action.payload : rental,
        ),
      };
    case RENTAL_ACTIONS.DELETE_RENTAL:
      return {
        ...state,
        rentals: action.payload,
      };
    case RENTAL_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case RENTAL_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    case RENTAL_ACTIONS.SET_TOTAL_RENTALS:
      return {
        ...state,
        totalRentals: action.payload,
      };
    default:
      return state;
  }
};

export default rentalReducer;
