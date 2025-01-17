const serviceReportReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SERVICE_REPORTS_SUCCESS':
      return {
        ...state,
        serviceReports: action.payload,
        loading: false,
        error: null,
      };

    case 'FETCH_SERVICE_REPORT_SUCCESS':
      return {
        ...state,
        serviceReport: action.payload,
        loading: false,
        error: null,
      };

    case 'CREATE_SERVICE_REPORT':
      return {
        ...state,
        serviceReports: [...state.serviceReports, action.payload],
        loading: false,
        error: null,
      };

    case 'UPDATE_SERVICE_REPORT':
      return {
        ...state,
        serviceReports: state.serviceReports.map((report) =>
          report.id === action.payload.id ? action.payload : report,
        ),
        loading: false,
        error: null,
      };

    case 'DELETE_SERVICE_REPORT':
      return {
        ...state,
        serviceReports: state.serviceReports.filter(
          (report) => report.id !== action.payload.id,
        ),
        loading: false,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default serviceReportReducer;
