import api from './api';
import { headerFormData } from './api';

// Crear una nueva renta
export const createRental = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await api.post('/rentals', formData, headerFormData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la renta:', error);
    throw error;
  }
};

// Obtener todas las rentas
export const getRentals = async () => {
  try {
    const response = await api.get('/rentals');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las rentas:', error);
    throw error;
  }
};

// Obtener una renta por ID
export const getRentalById = async (id) => {
  try {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la renta:', error);
    throw error;
  }
};

// Actualizar una renta
export const updateRental = async (id, data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await api.put(`/rentals/${id}`, formData, headerFormData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la renta:', error);
    throw error;
  }
};

// Eliminar una renta (lógica)
export const deleteRental = async (id) => {
  try {
    const response = await api.delete(`/rentals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la renta:', error);
    throw error;
  }
};

// Buscar rentas con filtros y paginación
export const searchRentals = async ({ search = '', page = 1, limit = 10 }) => {
  try {
    const response = await api.get('/rentals/search', {
      params: { search, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar rentas:', error);
    throw error;
  }
};

// Obtener todos los clientes
export const getClients = async () => {
  try {
    const response = await api.get('/clients');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Crear un nuevo cliente
export const createClient = async (data) => {
  try {
    const response = await api.post('/clients', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    throw error;
  }
};

// Obtener un cliente por ID
export const getClientById = async (id) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    throw error;
  }
};

// Actualizar un cliente
export const updateClient = async (id, data) => {
  try {
    console.log(id, data);
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    throw error;
  }
};

// Eliminar un cliente (lógica)
export const deleteClient = async (id) => {
  try {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    throw error;
  }
};

// Buscar clientes con filtros y paginación
export const searchClients = async ({
  search = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  order = 'desc',
}) => {
  try {
    const response = await api.get('/clients/search', {
      params: { search, page, limit, sortBy, order },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    throw error;
  }
};
