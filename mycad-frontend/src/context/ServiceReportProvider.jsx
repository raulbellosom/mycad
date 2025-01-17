import { useReducer, useEffect } from 'react';
import serviceReportReducer from './serviceReportReducer';
import ServiceReportContext from './serviceReportContext';
import useServiceReport from '../hooks/useServiceReport';

const ServiceReportProvider = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReportReducer, {
    serviceReports: [],
    serviceReport: {},
    loading: false,
    error: null,
  });

  const {
    fetchServiceReports,
    fetchServiceReport,
    createServiceReport,
    updateServiceReport,
    deleteServiceReport,
  } = useServiceReport(dispatch);

  useEffect(() => {
    fetchServiceReports.mutate();
  }, []);

  return (
    <ServiceReportContext.Provider
      value={{
        ...state,
        fetchServiceReports,
        fetchServiceReport,
        createServiceReport,
        updateServiceReport,
        deleteServiceReport,
      }}
    >
      {children}
    </ServiceReportContext.Provider>
  );
};

export default ServiceReportProvider;
