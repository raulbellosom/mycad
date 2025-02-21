import React, { useReducer, useEffect } from 'react';
import ClientsContext from './ClientsContext';
import clientsReducer from './ClientsReducer';
import { useQuery } from '@tanstack/react-query';
import { searchClients } from '../services/rentals.api';

const ClientsProvider = ({ children }) => {
  const initialState = {
    clients: [],
    client: {},
    selectedClientId: null,
    filters: {
      search: '',
    },
    pagination: {
      page: 1,
      limit: 10, // Resultados por página
    },
    totalClients: 0,
  };

  const [state, dispatch] = useReducer(clientsReducer, initialState);

  // Query para buscar y filtrar clientes
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['filteredClients', state.filters, state.pagination],
    queryFn: () =>
      searchClients({
        search: state.filters.search,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    keepPreviousData: true, // Mantiene los datos anteriores mientras se carga la nueva consulta
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({ type: 'SET_CLIENTS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_CLIENTS', payload: data.total });
    }
  }, [isSuccess, data]);

  return (
    <ClientsContext.Provider
      value={{ state, dispatch, fetchFilteredClients: refetch }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export default ClientsProvider;
