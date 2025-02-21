import React, { useReducer, useEffect } from 'react';
import RentalContext from './RentalContext';
import rentalReducer from './RentalReducer';
import { useQuery } from '@tanstack/react-query';
import { searchRentals } from '../services/rentals.api';

const RentalProvider = ({ children }) => {
  const initialState = {
    rentals: [],
    rental: {},
    selectedRentalId: null,
    filters: {
      search: '',
      status: 'ALL', // 'ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELED'
    },
    pagination: {
      page: 1,
      limit: 10,
    },
    totalRentals: 0,
  };

  const [state, dispatch] = useReducer(rentalReducer, initialState);

  // Query para buscar y filtrar rentas
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['filteredRentals', state.filters, state.pagination],
    queryFn: () =>
      searchRentals({
        search: state.filters.search,
        status: state.filters.status,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({ type: 'SET_RENTALS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_RENTALS', payload: data.total });
    }
  }, [isSuccess, data]);

  return (
    <RentalContext.Provider
      value={{ state, dispatch, fetchFilteredRentals: refetch }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export default RentalProvider;
