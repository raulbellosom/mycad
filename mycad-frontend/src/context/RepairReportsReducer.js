export const REPAIR_REPORTS_ACTIONS = {
  SET_REPAIR_REPORTS: 'SET_REPAIR_REPORTS',
  SET_REPAIR_REPORT: 'SET_REPAIR_REPORT',
  SET_SELECTED_REPAIR_REPORT_ID: 'SET_SELECTED_REPAIR_REPORT_ID',
  ADD_REPAIR_REPORT: 'ADD_REPAIR_REPORT',
  UPDATE_REPAIR_REPORT: 'UPDATE_REPAIR_REPORT',
  DELETE_REPAIR_REPORT: 'DELETE_REPAIR_REPORT',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_TOTAL_REPAIR_REPORTS: 'SET_TOTAL_REPAIR_REPORTS',
};

export const repairReportsInitialState = {
  repairReports: [], // Lista de reportes de reparación
  repairReport: {}, // Reporte actualmente seleccionado
  selectedRepairReportId: null, // ID del reporte seleccionado
  filters: {
    search: '',
    type: 'ALL',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  totalRepairReports: 0, // Total de reportes de reparación disponibles
};

const repairReportsReducer = (state, action) => {
  switch (action.type) {
    case REPAIR_REPORTS_ACTIONS.SET_REPAIR_REPORTS:
      return {
        ...state,
        repairReports: action.payload,
      };
    case REPAIR_REPORTS_ACTIONS.SET_REPAIR_REPORT:
      return {
        ...state,
        repairReport: action.payload,
      };
    case REPAIR_REPORTS_ACTIONS.SET_SELECTED_REPAIR_REPORT_ID:
      return {
        ...state,
        selectedRepairReportId: action.payload,
      };
    case REPAIR_REPORTS_ACTIONS.ADD_REPAIR_REPORT:
      return {
        ...state,
        repairReports: [...state.repairReports, action.payload],
      };
    case REPAIR_REPORTS_ACTIONS.UPDATE_REPAIR_REPORT:
      return {
        ...state,
        repairReports: state.repairReports.map((report) =>
          report.id === action.payload.id ? action.payload : report,
        ),
      };
    case REPAIR_REPORTS_ACTIONS.DELETE_REPAIR_REPORT:
      return {
        ...state,
        repairReports: state.repairReports.filter(
          (report) => report.id !== action.payload,
        ),
      };
    case REPAIR_REPORTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload, // Actualiza solo las propiedades necesarias
        },
      };
    case REPAIR_REPORTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload, // Actualiza solo las propiedades necesarias
        },
      };
    case REPAIR_REPORTS_ACTIONS.SET_TOTAL_REPAIR_REPORTS:
      return {
        ...state,
        totalRepairReports: action.payload,
      };
    default:
      return state;
  }
};

export default repairReportsReducer;
