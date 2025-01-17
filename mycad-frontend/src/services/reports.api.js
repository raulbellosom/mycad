import api from './api'; // Importamos la configuración base de Axios
import { headerFormData } from './api'; // Importamos los headers necesarios para FormData

// Crear un nuevo reporte de servicio
export const createServiceReport = async (data) => {
  try {
    const formData = new FormData();

    // Agregar los datos al FormData
    formData.append('vehicleId', data.vehicleId);
    formData.append('reportType', data.reportType);
    formData.append('serviceDate', data.serviceDate);
    formData.append('description', data.description);
    formData.append('totalCost', data.totalCost);
    formData.append('comments', data.comments || '');

    // Adjuntar partes reemplazadas en formato JSON
    if (data.replacedParts && data.replacedParts.length > 0) {
      formData.append('replacedParts', JSON.stringify(data.replacedParts));
    }

    // Agregar archivos adjuntos
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(
      '/service-reports',
      formData,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear el reporte de servicio:', error);
    throw error;
  }
};

// Obtener todos los reportes de servicio
export const getServiceReports = async () => {
  try {
    const response = await api.get('/service-reports');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los reportes de servicio:', error);
    throw error;
  }
};

// Actualizar un reporte de servicio
export const updateServiceReport = async (object) => {
  try {
    const { id, data } = object;
    const formData = new FormData();

    // Agregar datos al FormData
    formData.append('vehicleId', data.vehicleId);
    formData.append('reportType', data.reportType);
    formData.append('serviceDate', data.serviceDate);
    formData.append('description', data.description);
    formData.append('totalCost', data.totalCost);
    formData.append('comments', data.comments || '');

    // Adjuntar partes reemplazadas en formato JSON
    if (data.replacedParts && data.replacedParts.length > 0) {
      formData.append('replacedParts', JSON.stringify(data.replacedParts));
    }

    // Separar archivos nuevos de los existentes
    const existingAttachments = data.attachments.filter(
      (file) => !(file instanceof File) && file.id, // Archivos existentes tienen un ID
    );
    const newAttachments = data.attachments.filter(
      (file) => file instanceof File, // Archivos nuevos son instancias de File
    );

    // Agregar archivos nuevos al FormData
    newAttachments.forEach((file) => {
      formData.append('attachments', file);
    });

    // Agregar los archivos existentes como JSON
    if (existingAttachments.length > 0) {
      formData.append(
        'existingAttachments',
        JSON.stringify(existingAttachments),
      );
    }

    const response = await api.put(
      `/service-reports/${id}`,
      formData,
      headerFormData,
    );

    return response.data;
  } catch (error) {
    console.error('Error al actualizar el reporte de servicio:', error);
    throw error;
  }
};

// Eliminar un reporte de servicio (lógico)
export const deleteServiceReport = async (id) => {
  try {
    const response = await api.delete(`/service-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el reporte de servicio:', error);
    throw error;
  }
};

export const searchServiceReport = async ({
  search = '',
  type = 'ALL',
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await api.get('/service-reports/search', {
      params: { search, type, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar los reportes de servicio:', error);
    throw error;
  }
};

// Obtener un reporte de servicio por ID
export const getServiceReportById = async (id) => {
  try {
    if (id) {
      const response = await api.get(`/service-reports/${id}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error al obtener el reporte de servicio:', error);
    throw error;
  }
};

// Crear un nuevo reporte de reparación
export const createRepairReport = async (data) => {
  try {
    const formData = new FormData();

    // Agregar los datos al FormData
    formData.append('vehicleId', data.vehicleId);
    formData.append('repairDate', data.repairDate);
    formData.append('description', data.description);
    formData.append('totalCost', data.totalCost);
    formData.append('comments', data.comments || '');
    formData.append('workshopType', data.workshopType);
    if (data.workshopName) {
      formData.append('workshopName', data.workshopName);
    }
    if (data.workshopContact) {
      formData.append('workshopContact', data.workshopContact);
    }

    // Adjuntar partes reparadas en formato JSON
    if (data.repairedParts && data.repairedParts.length > 0) {
      formData.append('repairedParts', JSON.stringify(data.repairedParts));
    }

    // Agregar archivos adjuntos
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(
      '/repair-reports',
      formData,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear el reporte de reparación:', error);
    throw error;
  }
};

// Obtener todos los reportes de reparación
export const getRepairReports = async () => {
  try {
    const response = await api.get('/repair-reports');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los reportes de reparación:', error);
    throw error;
  }
};

// Actualizar un reporte de reparación
export const updateRepairReport = async (object) => {
  try {
    const { id, data } = object;
    const formData = new FormData();

    // Agregar datos al FormData
    formData.append('vehicleId', data.vehicleId);
    formData.append('repairDate', data.repairDate);
    formData.append('description', data.description);
    formData.append('totalCost', data.totalCost);
    formData.append('comments', data.comments || '');
    formData.append('workshopType', data.workshopType);
    if (data.workshopName) {
      formData.append('workshopName', data.workshopName);
    }
    if (data.workshopContact) {
      formData.append('workshopContact', data.workshopContact);
    }

    // Adjuntar partes reparadas en formato JSON
    if (data.repairedParts && data.repairedParts.length > 0) {
      formData.append('repairedParts', JSON.stringify(data.repairedParts));
    }

    // Separar archivos nuevos de los existentes
    const existingAttachments = data.attachments.filter(
      (file) => !(file instanceof File) && file.id, // Archivos existentes tienen un ID
    );
    const newAttachments = data.attachments.filter(
      (file) => file instanceof File, // Archivos nuevos son instancias de File
    );

    // Agregar archivos nuevos al FormData
    newAttachments.forEach((file) => {
      formData.append('attachments', file);
    });

    // Agregar los archivos existentes como JSON
    if (existingAttachments.length > 0) {
      formData.append(
        'existingAttachments',
        JSON.stringify(existingAttachments),
      );
    }

    const response = await api.put(
      `/repair-reports/${id}`,
      formData,
      headerFormData,
    );

    return response.data;
  } catch (error) {
    console.error('Error al actualizar el reporte de reparación:', error);
    throw error;
  }
};

// Eliminar un reporte de reparación (lógico)
export const deleteRepairReport = async (id) => {
  try {
    const response = await api.delete(`/repair-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el reporte de reparación:', error);
    throw error;
  }
};

// Buscar reportes de reparación
export const searchRepairReports = async ({
  search = '',
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await api.get('/repair-reports/search', {
      params: { search, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar los reportes de reparación:', error);
    throw error;
  }
};

// Obtener un reporte de reparación por ID
export const getRepairReportById = async (id) => {
  try {
    if (id) {
      const response = await api.get(`/repair-reports/${id}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error al obtener el reporte de reparación:', error);
    throw error;
  }
};
