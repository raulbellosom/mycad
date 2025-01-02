import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login,
  logout,
  register,
  loadUser,
  updateProfile,
  updatePassword,
  updateProfileImage,
} from '../services/api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

export const useAuthData = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    },
    onError: (error) => {
      dispatch({ type: 'AUTH_ERROR', payload: error });
      Notifies('error', 'Usuario o contraseña incorrectos');
    },
    onSettled: () => setLoading(false),
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    },
    onSettled: () => setLoading(false),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.removeQueries('user');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/';
    },
    onSettled: () => setLoading(false),
  });

  const loadUserData = useMutation({
    mutationFn: loadUser,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    },
    onError: (error) => {
      dispatch({ type: 'AUTH_ERROR', payload: error });
      return error;
    },
    onSettled: () => setLoading(false),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data);
      localStorage.setItem('user', JSON.stringify(data));
      Notifies('success', 'Perfil actualizado');
      dispatch({ type: 'PROFILE_UPDATED', payload: data });
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar el perfil');
    },
    onSettled: () => setLoading(false),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      Notifies('success', 'Contraseña actualizada');
      return data;
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar la contraseña');
      return error;
    },
    onSettled: () => setLoading(false),
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: updateProfileImage,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data);
      localStorage.setItem('user', JSON.stringify(data));
      Notifies('success', 'Imagen de perfil actualizada');
      dispatch({ type: 'PROFILE_IMAGE_UPDATED', payload: data });
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar la imagen de perfil');
    },
    onSettled: () => setLoading(false),
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loadUser: loadUserData.mutateAsync,
    updateProfile: (values) => {
      return updateProfileMutation.mutateAsync(values);
    },
    updatePassword: (values) => {
      return updatePasswordMutation.mutateAsync(values);
    },
    updateProfileImage: (values) => {
      return updateProfileImageMutation.mutateAsync(values);
    },
  };
};
