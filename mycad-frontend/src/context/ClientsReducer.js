export const CLIENTS_ACTIONS = {
  SET_CLIENTS: 'SET_CLIENTS',
  SET_CLIENT: 'SET_CLIENT',
  SET_SELECTED_CLIENT_ID: 'SET_SELECTED_CLIENT_ID',
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_TOTAL_CLIENTS: 'SET_TOTAL_CLIENTS',
};

export const clientsInitialState = {
  clients: [],
  client: {},
  selectedClientId: null,
  filters: {
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  totalClients: 0,
};

const clientsReducer = (state, action) => {
  switch (action.type) {
    case CLIENTS_ACTIONS.SET_CLIENTS:
      return { ...state, clients: action.payload };
    case CLIENTS_ACTIONS.SET_CLIENT:
      return { ...state, client: action.payload };
    case CLIENTS_ACTIONS.SET_SELECTED_CLIENT_ID:
      return { ...state, selectedClientId: action.payload };
    case CLIENTS_ACTIONS.ADD_CLIENT:
      return { ...state, clients: [...state.clients, action.payload] };
    case CLIENTS_ACTIONS.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client,
        ),
      };
    case CLIENTS_ACTIONS.DELETE_CLIENT:
      return { ...state, clients: action.payload };
    case CLIENTS_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case CLIENTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    case CLIENTS_ACTIONS.SET_TOTAL_CLIENTS:
      return { ...state, totalClients: action.payload };
    default:
      return state;
  }
};

export default clientsReducer;
