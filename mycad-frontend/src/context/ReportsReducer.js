export const REPORTS_ACTIONS = {
  SET_REPORTS: 'SET_REPORTS',
  SET_REPORT: 'SET_REPORT',
  SET_SELECTED_REPORT_ID: 'SET_SELECTED_REPORT_ID',
  ADD_REPORT: 'ADD_REPORT',
  UPDATE_REPORT: 'UPDATE_REPORT',
  DELETE_REPORT: 'DELETE_REPORT',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_TOTAL_REPORTS: 'SET_TOTAL_REPORTS',
};

export const reportsInitialState = {
  reports: [],
  report: {},
  selectedReportId: null,
  filters: {
    search: '',
    type: 'ALL', // 'ALL', 'MANTENIMIENTO', 'SERVICIO'
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  totalReports: 0, // Total de reportes
};

const reportsReducer = (state, action) => {
  switch (action.type) {
    case REPORTS_ACTIONS.SET_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };
    case REPORTS_ACTIONS.SET_REPORT:
      return {
        ...state,
        report: action.payload,
      };
    case REPORTS_ACTIONS.SET_SELECTED_REPORT_ID:
      return {
        ...state,
        selectedReportId: action.payload,
      };
    case REPORTS_ACTIONS.ADD_REPORT:
      return {
        ...state,
        reports: [...state.reports, action.payload],
      };
    case REPORTS_ACTIONS.UPDATE_REPORT:
      return {
        ...state,
        reports: state.reports.map((report) =>
          report.id === action.payload.id ? action.payload : report,
        ),
      };
    case REPORTS_ACTIONS.DELETE_REPORT:
      return {
        ...state,
        reports: action.payload,
      };
    case REPORTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload, // Solo actualiza las propiedades de filtro necesarias
        },
      };
    case REPORTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload, // Solo actualiza las propiedades de paginación necesarias
        },
      };
    case REPORTS_ACTIONS.SET_TOTAL_REPORTS:
      return {
        ...state,
        totalReports: action.payload,
      };
    default:
      return state;
  }
};

export default reportsReducer;
