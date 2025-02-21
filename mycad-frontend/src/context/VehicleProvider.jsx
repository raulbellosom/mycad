import { useEffect, useReducer } from 'react';
import VehicleContext from './VehicleContext';
import VehicleReducer from './VehicleReducer';
import useVehicle from '../hooks/useVehicle';

const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(VehicleReducer, {
    vehicles: [],
    pagination: {},
    vehicle: {},
    loading: true,
  });

  const {
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    createMultipleVehicles,
  } = useVehicle(dispatch);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <VehicleContext.Provider
      value={{
        ...state,
        fetchVehicles,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        createMultipleVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export default VehicleProvider;
