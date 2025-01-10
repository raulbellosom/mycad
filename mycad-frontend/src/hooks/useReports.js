import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import ReportsContext from '../context/ReportsContext';
import {
  getServiceReports,
  createServiceReport,
  updateServiceReport,
  deleteServiceReport,
  searchServiceReport,
  getServiceReportById,
} from '../services/reports.api'; // Importa correctamente `searchServiceReport`
import Notifies from '../components/Notifies/Notifies';

export const useReports = () => {
  const { state, dispatch } = useContext(ReportsContext);
  const queryClient = useQueryClient();

  // Obtener todos los reportes
  const fetchReports = useQuery({
    queryKey: ['reports'],
    queryFn: getServiceReports,
    onSuccess: (data) => {
      dispatch({ type: 'SET_REPORTS', payload: data });
    },
    onError: () => {
      Notifies('error', 'Error al obtener los reportes');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const fetchReportById = async (id) => {
    try {
      const report = await getServiceReportById(id);
      dispatch({ type: 'SET_REPORT', payload: report });
    } catch (error) {
      Notifies('error', 'Error al obtener el reporte');
    }
  };

  // Crear un reporte
  const createNewReport = useMutation({
    mutationFn: createServiceReport,
    onSuccess: (newReport) => {
      dispatch({ type: 'ADD_REPORT', payload: newReport });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      Notifies('success', 'Reporte creado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al crear el reporte');
    },
  });

  // Actualizar un reporte
  const modifyReport = useMutation({
    mutationFn: updateServiceReport,
    onSuccess: (updatedReport) => {
      dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      Notifies('success', 'Reporte actualizado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al actualizar el reporte');
    },
  });

  // Eliminar un reporte
  const removeReport = useMutation({
    mutationFn: deleteServiceReport,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_REPORT', payload: id });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      Notifies('success', 'Reporte eliminado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al eliminar el reporte');
    },
  });

  // Buscar y filtrar reportes con filtros y paginación
  const fetchFilteredReports = useQuery({
    queryKey: ['filteredReports', state.filters, state.pagination],
    queryFn: () =>
      searchServiceReport({
        search: state.filters.search,
        type: state.filters.type,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    onSuccess: (data) => {
      dispatch({ type: 'SET_REPORTS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_REPORTS', payload: data.total });
    },
    onError: () => {
      Notifies('error', 'Error al buscar reportes');
    },
    keepPreviousData: true, // Mantiene los datos actuales mientras carga
  });

  return {
    state,
    dispatch,
    fetchReports,
    fetchFilteredReports,
    createNewReport,
    modifyReport,
    removeReport,
    fetchReportById,
  };
};
