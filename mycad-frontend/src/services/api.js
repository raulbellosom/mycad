import axios from 'axios';
import { saveAs } from 'file-saver';

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/';
export const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const headerFormData = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (credentials) => {
  try {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfile = async (profile) => {
  try {
    const response = await api.put('/auth/updateProfile', profile);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async (passwords) => {
  try {
    const response = await api.put('/auth/updatePassword', passwords);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfileImage = async (profileImage) => {
  try {
    let data = new FormData();
    data.append('profileImage', profileImage);
    const response = await api.put(
      '/auth/updateProfileImage',
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    let data = new FormData();

    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append('profileImage', image);
    }

    data.append(
      'userData',
      JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        phone: user.phone,
        role: user.role,
        password: user.password,
        repeatPassword: user.repeatPassword,
      }),
    );
    const response = await api.post(`/users`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    let data = new FormData();
    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append('profileImage', image);
    }
    data.append(
      'userData',
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userName: user.userName,
        role: user.role,
        status: user.status,
        password: user.password,
        repeatPassword: user.repeatPassword,
      }),
    );
    const response = await api.put(`/users/${user.id}`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const changePasswordUser = async (user) => {
  try {
    const response = await api.put(`/users/changePassword/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchUsers = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  signal,
}) => {
  try {
    const response = await api.get('/users/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicles = async () => {
  try {
    const response = await api.get(`/vehicles`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicle = async ({ id: vehicleId, signal }) => {
  try {
    const response = await api.get(`/vehicles/${vehicleId}`, { signal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVehicle = async (vehicle) => {
  try {
    let data = new FormData();

    if (vehicle.images && vehicle.images.length > 0) {
      vehicle.images.forEach((image) => {
        data.append('images', image);
      });
    }

    if (vehicle.files && vehicle.files.length > 0) {
      vehicle.files.forEach((file) => {
        data.append('files', file);
      });
    }

    data.append('vehicle', JSON.stringify(vehicle));
    const response = await api.post(`/vehicles`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVehicle = async (vehicle) => {
  try {
    const id = vehicle.id;
    let data = new FormData();
    let currentImages = vehicle.images.filter((image) => image instanceof File);
    vehicle.images = vehicle.images.filter((image) => !(image instanceof File));
    let currentFiles = vehicle.files.filter((file) => file instanceof File);
    vehicle.files = vehicle.files.filter((file) => !(file instanceof File));

    if (currentImages && currentImages.length > 0) {
      currentImages.forEach((image) => {
        data.append('images', image);
      });
    }

    if (currentFiles && currentFiles.length > 0) {
      currentFiles.forEach((file) => {
        data.append('files', file);
      });
    }

    data.append('vehicle', JSON.stringify(vehicle));
    const response = await api.put(`/vehicles/${id}`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await api.delete(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchVehicles = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  conditionName,
  deepSearch,
  signal,
}) => {
  try {
    const parsedDeepSearch = JSON.stringify(deepSearch);
    const response = await api.get('/vehicles/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
        conditionName,
        deepSearch: parsedDeepSearch,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createMultipleVehicles = async (csvFile, userId) => {
  try {
    let data = new FormData();

    data.append('csvFile', csvFile);
    data.append('userId', JSON.stringify(userId));

    const response = await api.post(
      `/vehicles/createMultipleVehicles`,
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleModels = async () => {
  try {
    const response = await api.get(`/vehicles/vehicleModels`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleModel = async (vehicleModelId) => {
  try {
    const response = await api.post(
      `/vehicles/vehicleModels/${vehicleModelId}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVehicleModel = async (vehicleModel) => {
  try {
    const response = await api.post(`/vehicles/vehicleModels`, vehicleModel);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVehicleModel = async (vehicleModel) => {
  try {
    const response = await api.put(
      `/vehicles/vehicleModels/${vehicleModel.id}`,
      vehicleModel,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVehicleModel = async (vehicleModelId) => {
  try {
    const response = await api.delete(
      `/vehicles/vehicleModels/${vehicleModelId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createMultipleModels = async (csvFile) => {
  try {
    let data = new FormData();

    data.append('csvFile', csvFile);

    const response = await api.post(
      `/vehicles/vehicleModels/createMultipleModels`,
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchModels = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  signal,
}) => {
  try {
    const response = await api.get('/vehicles/vehicleModels/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleTypes = async () => {
  try {
    const response = await api.get(`/vehicles/vehicleTypes`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleType = async (vehicleTypeId) => {
  try {
    const response = await api.post(`/vehicles/vehicleTypes/${vehicleTypeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVehicleType = async (vehicleType) => {
  try {
    const response = await api.post(`/vehicles/vehicleTypes`, vehicleType);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVehicleType = async (vehicleType) => {
  try {
    const response = await api.put(
      `/vehicles/vehicleTypes/${vehicleType.id}`,
      vehicleType,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVehicleType = async (vehicleTypeId) => {
  try {
    const response = await api.delete(
      `/vehicles/vehicleTypes/${vehicleTypeId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleBrands = async () => {
  try {
    const response = await api.get(`/vehicles/vehicleBrands`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleBrand = async (vehicleBrandId) => {
  try {
    const response = await api.post(
      `/vehicles/vehicleBrands/${vehicleBrandId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVehicleBrand = async (vehicleBrand) => {
  try {
    const response = await api.post(`/vehicles/vehicleBrands`, vehicleBrand);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVehicleBrand = async (vehicleBrand) => {
  try {
    const response = await api.put(
      `/vehicles/vehicleBrands/${vehicleBrand.id}`,
      vehicleBrand,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVehicleBrand = async (vehicleBrandId) => {
  try {
    const response = await api.delete(
      `/vehicles/vehicleBrands/${vehicleBrandId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleConditions = async () => {
  try {
    const response = await api.get(`/vehicles/vehicleConditions`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVehicleCondition = async (vehicleConditionId) => {
  try {
    const response = await api.post(
      `/vehicles/vehicleConditions/${vehicleConditionId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVehicleCondition = async (vehicleCondition) => {
  try {
    const response = await api.post(
      `/vehicles/vehicleConditions`,
      vehicleCondition,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVehicleCondition = async (vehicleCondition) => {
  try {
    const response = await api.put(
      `/vehicles/vehicleConditions/${vehicleCondition.id}`,
      vehicleCondition,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVehicleCondition = async (vehicleConditionId) => {
  try {
    const response = await api.delete(
      `/vehicles/vehicleConditions/${vehicleConditionId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Service Reports
export const getAllServiceReports = async (vehicleId) => {
  try {
    const response = await api.get(`/service-reports/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getServiceReport = async ({ vehicleId, reportId, signal }) => {
  try {
    const response = await api.get(
      `/service-reports/${vehicleId}/${reportId}`,
      { signal },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createServiceReport = async (vehicleId, report) => {
  try {
    let data = new FormData();

    if (report.files && report.files.length > 0) {
      report.files.forEach((file) => {
        data.append('files', file);
      });
    }

    data.append('report', JSON.stringify(report)); // Agregar la información del reporte

    const response = await api.post(
      `/service-reports/${vehicleId}`,
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateServiceReport = async (vehicleId, reportId, report) => {
  try {
    let data = new FormData();

    if (report.files && report.files.length > 0) {
      report.files.forEach((file) => {
        data.append('files', file);
      });
    }

    data.append('report', JSON.stringify(report)); // Agregar la información del reporte

    const response = await api.put(
      `/service-reports/${vehicleId}/${reportId}`,
      data,
      headerFormData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteServiceReport = async (vehicleId, reportId) => {
  try {
    const response = await api.delete(
      `/service-reports/${vehicleId}/${reportId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downloadFile = async (file) => {
  try {
    const response = await api.get(file.url, {
      responseType: 'blob',
    });
    const fileName = `${file?.metadata?.originalname || file?.id}`;

    saveAs(response.data, fileName ?? 'file');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default api;
