import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getServiceReports,
  getServiceReport,
  createServiceReport,
  updateServiceReport,
  deleteServiceReport,
} from '../services/api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

const useServiceReport = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const fetchServiceReports = useMutation({
    mutationFn: getServiceReports,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: 'FETCH_SERVICE_REPORTS_SUCCESS', payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const fetchServiceReport = ({ id }) => {
    return useQuery(
      ['serviceReport', { id }],
      ({ signal }) => getServiceReport({ id, signal }),
      {
        staleTime: Infinity,
        onSuccess: (data) => {
          dispatch({ type: 'FETCH_SERVICE_REPORT', payload: data });
        },
        onError: (error) => {
          Notifies('error', 'Error al buscar reporte de servicio');
        },
      },
    );
  };

  const createServiceReportMutation = useMutation({
    mutationFn: createServiceReport,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries('serviceReports');
      dispatch({ type: 'CREATE_SERVICE_REPORT', payload: data });
      Notifies('success', 'Reporte de servicio creado exitosamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al crear el reporte de servicio');
    },
    onSettled: () => setLoading(false),
  });

  const updateServiceReportMutation = useMutation({
    mutationFn: updateServiceReport,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries('serviceReports');
      dispatch({ type: 'UPDATE_SERVICE_REPORT', payload: data });
      Notifies('success', 'Reporte de servicio actualizado exitosamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar el reporte de servicio');
    },
    onSettled: () => setLoading(false),
  });

  const deleteServiceReportMutation = useMutation({
    mutationFn: deleteServiceReport,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries('serviceReports');
      dispatch({ type: 'DELETE_SERVICE_REPORT', payload: data.data });
      Notifies('success', 'Reporte de servicio eliminado exitosamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al eliminar el reporte de servicio');
    },
    onSettled: () => setLoading(false),
  });

  return {
    fetchServiceReports: fetchServiceReports.mutate,
    fetchServiceReport,
    createServiceReport: (values) => {
      return createServiceReportMutation.mutateAsync(values);
    },
    updateServiceReport: (values) => {
      return updateServiceReportMutation.mutateAsync(values);
    },
    deleteServiceReport: deleteServiceReportMutation.mutate,
  };
};

export default useServiceReport;
