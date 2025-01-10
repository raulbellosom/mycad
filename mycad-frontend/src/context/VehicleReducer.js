const VehicleReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_VEHICLES_SUCCESS':
      return {
        ...state,
        vehicles: action.payload,
        loading: false,
      };
    case 'FETCH_VEHICLE':
      return {
        ...state,
        vehicle: action.payload,
        loading: false,
      };
    case 'CREATE_VEHICLE':
      return {
        ...state,
        vehicle: action.payload,
        vehicles: [...state.vehicles, action.payload],
        loading: false,
      };
    case 'CREATE_MULTIPLE_VEHICLES':
      return {
        ...state,
        vehicles: [...state.vehicles, ...action.payload?.createdVehicles],
        loading: false,
      };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicle: action.payload,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle,
        ),
        loading: false,
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default VehicleReducer;
