import { createContext, useContext } from 'react';

const ServiceReportContext = createContext({
  serviceReports: [],
  serviceReport: {},
  fetchServiceReports: () => {},
  fetchServiceReport: () => {},
  createServiceReport: () => {},
  updateServiceReport: () => {},
  deleteServiceReport: () => {},
});

export const useServiceReportContext = () => useContext(ServiceReportContext);

export default ServiceReportContext;
