import React, { useReducer, useEffect } from 'react';
import ReportsContext from './ReportsContext';
import reportsReducer from './ReportsReducer';
import { useQuery } from '@tanstack/react-query';
import { searchServiceReport } from '../services/reports.api';

const ReportsProvider = ({ children }) => {
  const initialState = {
    reports: [],
    report: {},
    selectedReportId: null,
    filters: {
      search: '',
      type: 'ALL', // 'ALL', 'MANTENIMIENTO', 'SERVICIO'
    },
    pagination: {
      page: 1,
      limit: 10, // Resultados por página
    },
    totalReports: 0, // Total de reportes
  };

  const [state, dispatch] = useReducer(reportsReducer, initialState);

  // Query para buscar y filtrar reportes
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['filteredReports', state.filters, state.pagination],
    queryFn: () =>
      searchServiceReport({
        search: state.filters.search,
        type: state.filters.type,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    keepPreviousData: true, // Mantiene los datos anteriores mientras se carga la nueva consulta
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({ type: 'SET_REPORTS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_REPORTS', payload: data.total });
    }
  }, [isSuccess, data]);

  return (
    <ReportsContext.Provider
      value={{ state, dispatch, fetchFilteredReports: refetch }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsProvider;
