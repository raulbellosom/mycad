import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import ClientsContext from '../context/ClientsContext';
import {
  getClients as getAllClients,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientById,
} from '../services/rentals.api';
import Notifies from '../components/Notifies/Notifies';

export const useClients = () => {
  const { state, dispatch } = useContext(ClientsContext);
  const queryClient = useQueryClient();

  // Obtener todos los clientes
  const fetchClients = useQuery({
    queryKey: ['clients'],
    queryFn: getAllClients,
    onSuccess: (data) => {
      dispatch({ type: 'SET_CLIENTS', payload: data });
    },
    onError: () => {
      Notifies('error', 'Error al obtener los clientes');
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener un cliente por su ID
  const fetchClientById = async (id) => {
    try {
      const client = await getClientById(id);
      dispatch({ type: 'SET_CLIENT', payload: client });
    } catch (error) {
      Notifies('error', 'Error al obtener el cliente');
    }
  };

  // Crear un nuevo cliente
  const { mutate: createNewClient } = useMutation({
    mutationFn: createClient,
    onSuccess: (newClient) => {
      dispatch({ type: 'ADD_CLIENT', payload: newClient });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      Notifies('success', 'Cliente creado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al crear el cliente');
    },
  });

  // Actualizar un cliente
  const { mutate: modifyClient } = useMutation({
    mutationFn: (client) => updateClient(client.id, client),
    onSuccess: (updatedClient) => {
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      Notifies('success', 'Cliente actualizado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al actualizar el cliente');
    },
  });

  // Eliminar un cliente (lógica: deshabilitar el cliente)
  const { mutate: removeClient } = useMutation({
    mutationFn: deleteClient,
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_CLIENT', payload: data.data });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      Notifies('success', 'Cliente eliminado correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al eliminar el cliente');
    },
  });

  // Buscar y filtrar clientes con filtros y paginación
  const fetchFilteredClients = useQuery({
    queryKey: ['filteredClients', state.filters, state.pagination],
    queryFn: () =>
      searchClients({
        search: state.filters.search,
        page: state.pagination.page,
        limit: state.pagination.limit,
      }),
    onSuccess: (data) => {
      dispatch({ type: 'SET_CLIENTS', payload: data.data });
      dispatch({ type: 'SET_TOTAL_CLIENTS', payload: data.total });
    },
    onError: () => {
      Notifies('error', 'Error al buscar clientes');
    },
    keepPreviousData: true,
  });

  return {
    state,
    dispatch,
    fetchClients,
    fetchFilteredClients,
    createNewClient, // ahora es una función
    modifyClient, // ahora es una función
    removeClient, // ahora es una función
    fetchClientById,
  };
};
