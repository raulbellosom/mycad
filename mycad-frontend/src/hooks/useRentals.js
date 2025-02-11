import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import RentalContext from '../context/RentalContext';
import {
  getRentals,
  createRental,
  updateRental,
  deleteRental,
  searchRentals,
  getRentalById,
} from '../services/rentals.api';
import Notifies from '../components/Notifies/Notifies';

export const useRentals = () => {
  const { state, dispatch } = useContext(RentalContext);
  const queryClient = useQueryClient();

  // Obtener todas las rentas
  const fetchRentals = useQuery({
    queryKey: ['rentals'],
    queryFn: getRentals,
    onSuccess: (data) => {
      dispatch({ type: 'SET_RENTALS', payload: data });
    },
    onError: () => {
      Notifies('error', 'Error al obtener las rentas');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener una renta por ID
  const fetchRentalById = async (id) => {
    try {
      const rental = await getRentalById(id);
      dispatch({ type: 'SET_RENTAL', payload: rental });
    } catch (error) {
      Notifies('error', 'Error al obtener la renta');
    }
  };

  // Crear una nueva renta
  const createNewRental = useMutation({
    mutationFn: createRental,
    onSuccess: (newRental) => {
      dispatch({ type: 'ADD_RENTAL', payload: newRental });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      Notifies('success', 'Renta creada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al crear la renta');
    },
  });

  // Actualizar una renta
  const modifyRental = useMutation({
    mutationFn: updateRental,
    onSuccess: (updatedRental) => {
      dispatch({ type: 'UPDATE_RENTAL', payload: updatedRental });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      Notifies('success', 'Renta actualizada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al actualizar la renta');
    },
  });

  // Eliminar una renta (eliminación lógica)
  const removeRental = useMutation({
    mutationFn: deleteRental,
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_RENTAL', payload: data.data });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      Notifies('success', 'Renta eliminada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al eliminar la renta');
    },
  });

  // Buscar y filtrar rentas con filtros y paginación
  const fetchFilteredRentals = useQuery({
    queryKey: ['filteredRentals', state.filters, state.pagination],
    queryFn: () =>
      searchRentals({
        search: state.filters.search,
        status: state.filters.status,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    onSuccess: (data) => {
      dispatch({ type: 'SET_RENTALS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_RENTALS', payload: data.total });
    },
    onError: () => {
      Notifies('error', 'Error al buscar rentas');
    },
    keepPreviousData: true,
  });

  return {
    state,
    dispatch,
    fetchRentals,
    fetchFilteredRentals,
    createNewRental,
    modifyRental,
    removeRental,
    fetchRentalById,
  };
};
