import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import RepairReportsContext from '../context/RepairReportsContext';
import {
  getRepairReports,
  createRepairReport,
  updateRepairReport,
  deleteRepairReport,
  searchRepairReports,
  getRepairReportById,
} from '../services/reports.api';
import Notifies from '../components/Notifies/Notifies';

export const useRepairReports = () => {
  const { state, dispatch } = useContext(RepairReportsContext);
  const queryClient = useQueryClient();

  // Obtener todos los reportes de reparación
  const fetchRepairReports = useQuery({
    queryKey: ['repairReports'],
    queryFn: getRepairReports,
    onSuccess: (data) => {
      dispatch({ type: 'SET_REPAIR_REPORTS', payload: data });
    },
    onError: () => {
      Notifies('error', 'Error al obtener los reportes de reparación');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener un reporte de reparación por ID
  const fetchRepairReportById = async (id) => {
    try {
      const report = await getRepairReportById(id);
      dispatch({ type: 'SET_REPAIR_REPORT', payload: report });
    } catch (error) {
      Notifies('error', 'Error al obtener el reporte de reparación');
    }
  };

  // Crear un reporte de reparación
  const createNewRepairReport = useMutation({
    mutationFn: createRepairReport,
    onSuccess: (newReport) => {
      dispatch({ type: 'ADD_REPAIR_REPORT', payload: newReport });
      queryClient.invalidateQueries({ queryKey: ['repairReports'] });
      Notifies('success', 'Reporte de reparación creado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al crear el reporte de reparación');
    },
  });

  // Actualizar un reporte de reparación
  const modifyRepairReport = useMutation({
    mutationFn: updateRepairReport,
    onSuccess: (updatedReport) => {
      dispatch({ type: 'UPDATE_REPAIR_REPORT', payload: updatedReport });
      queryClient.invalidateQueries({ queryKey: ['repairReports'] });
      Notifies('success', 'Reporte de reparación actualizado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al actualizar el reporte de reparación');
    },
  });

  // Eliminar un reporte de reparación
  const removeRepairReport = useMutation({
    mutationFn: deleteRepairReport,
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_REPAIR_REPORT', payload: data });
      queryClient.invalidateQueries({ queryKey: ['repairReports'] });
      Notifies('success', 'Reporte de reparación eliminado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al eliminar el reporte de reparación');
    },
  });

  // Buscar y filtrar reportes de reparación con filtros y paginación
  const fetchFilteredRepairReports = useQuery({
    queryKey: ['filteredRepairReports', state.filters, state.pagination],
    queryFn: () =>
      searchRepairReports({
        search: state.filters.search,
        type: state.filters.type,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    onSuccess: (data) => {
      dispatch({ type: 'SET_REPAIR_REPORTS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_REPAIR_REPORTS', payload: data.total });
    },
    onError: () => {
      Notifies('error', 'Error al buscar reportes de reparación');
    },
    keepPreviousData: true, // Mantiene los datos actuales mientras carga
  });

  return {
    state,
    dispatch,
    fetchRepairReports,
    fetchFilteredRepairReports,
    createNewRepairReport,
    modifyRepairReport,
    removeRepairReport,
    fetchRepairReportById,
  };
};
