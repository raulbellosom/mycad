import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRole,
  getRoleById,
  getRoles,
  deleteRole,
  updateRole,
  getRolePermissions,
  getRolePermissionByRoleId,
  createRolePermission,
  deleteRolePermission,
} from '../services/secure.api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

const useRole = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const useCreateRole = useMutation({
    mutationFn: createRole,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'CREATE_ROLE', payload: data });
      Notifies('success', 'Rol creado correctamente');
    },
    onError: (error) => {
      console.log('error on createRole', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('roles');
      setLoading(false);
    },
  });

  const useUpdateRole = useMutation({
    mutationFn: updateRole,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_ROLE', payload: data });
      Notifies('success', 'Rol actualizado correctamente');
    },
    onError: (error) => {
      console.log('error on updateRole', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('roles');
      setLoading(false);
    },
  });

  const useDeleteRole = useMutation({
    mutationFn: deleteRole,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_ROLE', payload: data });
      Notifies('success', 'Rol eliminado correctamente');
    },
    onError: (error) => {
      console.log('error on deleteRole', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('roles');
      setLoading(false);
    },
  });

  const useGetRoles = useMutation({
    mutationFn: getRoles,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_ROLES', payload: data });
    },
    onError: (error) => {
      console.log('error on getRoles', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useGetRoleById = useMutation({
    mutationFn: getRoleById,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_ROLE', payload: data });
    },
    onError: (error) => {
      console.log('error on getRoleById', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useGetRolePermissions = useMutation({
    mutationFn: getRolePermissions,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_ROLE_PERMISSIONS', payload: data });
    },
    onError: (error) => {
      console.log('error on getRolePermissions', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useGetRolePermissionByRoleId = useMutation({
    mutationFn: getRolePermissionByRoleId,
    onMutate: () => {
      setLoading(false);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_ROLE_PERMISSION_BY_ROLE_ID', payload: data });
      return data;
    },
    onError: (error) => {
      console.log('error on getRolePermissionByRoleId', error);
      Notifies('error', 'Error al obtener los permisos del rol');
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useCreateRolePermission = useMutation({
    mutationFn: createRolePermission,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      Notifies('success', 'Permiso asignado correctamente');
      dispatch({ type: 'CREATE_ROLE_PERMISSION', payload: data });
      return data;
    },
    onError: (error) => {
      console.log('error on createRolePermission', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useDeleteRolePermission = useMutation({
    mutationFn: deleteRolePermission,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      Notifies('success', 'Permiso eliminado correctamente');
      dispatch({ type: 'DELETE_ROLE_PERMISSION', payload: data });
      return data;
    },
    onError: (error) => {
      console.log('error on deleteRolePermission', error);
      Notifies('error', error?.response?.data?.error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return {
    useCreateRole: (role) => useCreateRole.mutateAsync(role),
    useUpdateRole: (role) => useUpdateRole.mutateAsync(role),
    useDeleteRole: (id) => useDeleteRole.mutateAsync(id),
    useGetRoles: () => useGetRoles.mutateAsync(),
    useGetRoleById: (id) => useGetRoleById.mutateAsync(id),
    useGetRolePermissions: () => useGetRolePermissions.mutateAsync(),
    useGetRolePermissionByRoleId: (roleId) =>
      useGetRolePermissionByRoleId.mutateAsync(roleId),
    useCreateRolePermission: (rolePermission) =>
      useCreateRolePermission.mutateAsync(rolePermission),
    useDeleteRolePermission: (rolePermission) =>
      useDeleteRolePermission.mutateAsync(rolePermission),
  };
};

export default useRole;
