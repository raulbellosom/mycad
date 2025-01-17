import React, { useReducer, useEffect } from 'react';
import RepairReportsContext from './RepairReportsContext';
import repairReportsReducer, {
  repairReportsInitialState,
  REPAIR_REPORTS_ACTIONS,
} from './RepairReportsReducer';
import { useQuery } from '@tanstack/react-query';
import { searchRepairReports } from '../services/reports.api';

const RepairReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    repairReportsReducer,
    repairReportsInitialState,
  );

  // Query para buscar y filtrar reportes de reparación
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['filteredRepairReports', state.filters, state.pagination],
    queryFn: () =>
      searchRepairReports({
        search: state.filters.search,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({
        type: REPAIR_REPORTS_ACTIONS.SET_REPORTS,
        payload: data.data,
      });
      dispatch({
        type: REPAIR_REPORTS_ACTIONS.SET_TOTAL_REPORTS,
        payload: data.total,
      });
    }
  }, [isSuccess, data]);

  return (
    <RepairReportsContext.Provider
      value={{ state, dispatch, fetchFilteredRepairReports: refetch }}
    >
      {children}
    </RepairReportsContext.Provider>
  );
};

export default RepairReportsProvider;
