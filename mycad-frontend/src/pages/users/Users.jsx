import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import { IoMdAdd } from 'react-icons/io';
import { Table as T } from 'flowbite-react';
import ModalRemove from '../../components/Modals/ModalRemove';
import { searchUsers } from '../../services/api';
import usersColumns from '../../utils/usersColumns';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import Notifies from '../../components/Notifies/Notifies';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import { useAuthContext } from '../../context/AuthContext';
import { FaLock, FaUserShield } from 'react-icons/fa';
import { useRoleContext } from '../../context/RoleContext';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import {
  UserFormChangePasswordSchema,
  UserFormSchema,
  UserFormUpdateSchema,
} from '../../components/Users/UserFormSchema';
import UserFormFields from '../../components/Users/UserFormFields';
const Card = React.lazy(() => import('../../components/Card/Card'));
const TableHeader = React.lazy(
  () => import('../../components/Table/TableHeader'),
);
const TableFooter = React.lazy(
  () => import('../../components/Table/TableFooter'),
);
const TableActions = React.lazy(
  () => import('../../components/Table/TableActions'),
);
const TableResultsNotFound = React.lazy(
  () => import('../../components/Table/TableResultsNotFound'),
);
const Table = React.lazy(() => import('../../components/Table/Table'));
import classNames from 'classnames';
import UserChangePasswordFormFields from '../../components/Users/UserChangePasswordFormFields';
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const Users = () => {
  const lastChange = useRef();
  const { user: sesionUser } = useAuthContext();
  const { roles } = useRoleContext();
  const { useCreateUser, useDeleteUser, useUpdateUser, useChangePasswordUser } =
    useUserContext();
  const [columns, setColumns] = useState(usersColumns);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phone: '',
    role: '',
    photo: '',
    status: true,
    password: '',
    repeatPassword: '',
  });
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    pageSize: 5,
    page: currentPageNumber,
    sortBy: 'name',
    order: 'asc',
  });

  const {
    data: users,
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ['users', searchFilters],
    queryFn: ({ signal }) => searchUsers(searchFilters, signal),
    staleTime: Infinity,
  });

  useEffect(() => {
    refetch();
    setRefreshData(false);
  }, [searchFilters, refreshData]);

  const goOnPrevPage = useCallback(() => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page: prevState?.page - 1,
      };
    });
  }, []);

  const goOnNextPage = useCallback(() => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page: prevState?.page + 1,
      };
    });
  }, []);

  const handleSelectChange = useCallback((page) => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page,
      };
    });
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
      lastChange.current = setTimeout(() => {
        lastChange.current = null;
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            searchTerm: e.target.value,
          };
        });
      }, 600);
    },
    [searchFilters?.searchTerm],
  );

  const changePageSize = (e) => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        pageSize: e.target.value,
      };
    });
  };

  const sortBy = (column) => {
    const selectedHeaderIndex = columns?.findIndex((col) => col.id === column);
    let updatedHeaders = [];
    if (selectedHeaderIndex !== -1) {
      const selectedHeader = columns[selectedHeaderIndex];
      selectedHeader;
      const updatedHeader = {
        ...selectedHeader,
        order: selectedHeader?.order === 'asc' ? 'desc' : 'asc',
      };
      updatedHeaders = [...columns];
      updatedHeaders[selectedHeaderIndex] = updatedHeader;
      setSearchFilters((prevState) => {
        return {
          ...prevState,
          sortBy: column,
          order: updatedHeader?.order,
        };
      });
    }
    setColumns(updatedHeaders);
  };

  const handleRefreshData = () => {
    setRefreshData(true);
    Notifies('success', 'Datos actualizados correctamente');
  };

  const onEditUser = (item) => {
    setEditMode(true);
    setInitialValues({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      userName: item.userName,
      phone: item.phone,
      role: item.role.id,
      photo: '',
      status: item.status,
      password: '',
      repeatPassword: '',
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await useUpdateUser(values) : await useCreateUser(values);
      setSubmitting(false);
      resetForm();
      setInitialValues({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        phone: '',
        role: '',
        photo: '',
        status: true,
        password: '',
        repeatPassword: '',
        id: '',
      });
      setEditMode(false);
      setIsOpenModal(false);
    } catch (err) {
      console.log('error on submit create or edit user', err);
      Notifies('error', 'Error al guardar el usuario');
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setChangePasswordModal(false);
    setEditMode(false);
    setInitialValues({
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      phone: '',
      role: '',
      photo: '',
      status: true,
      password: '',
      repeatPassword: '',
      id: '',
    });
  };

  const onRemoveUser = (id) => {
    setDeleteUserId(id);
    setIsRemoveModalOpen(true);
  };

  const onConfirmRemoveUser = async () => {
    try {
      await useDeleteUser(deleteUserId);
      setIsRemoveModalOpen(false);
      setDeleteUserId(null);
    } catch (err) {
      console.log('error on remove user', err);
      Notifies('error', 'Error al eliminar el usuario');
    }
  };

  const onChangeUserPassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await useChangePasswordUser(values);
      setSubmitting(false);
      resetForm();
      setInitialValues({
        id: '',
        password: '',
        repeatPassword: '',
      });
      setChangePasswordModal(false);
    } catch (err) {
      console.log('error on submit change password', err);
      Notifies('error', 'Error al cambiar la contraseña del usuario');
    }
  };

  const isCreateUserPermission = useCheckPermissions('create_users');
  const isEditUserPermission = useCheckPermissions('edit_users');
  const isRemoveUserPermission = useCheckPermissions('delete_users');

  return (
    <div className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        title={'Usuarios'}
        icon={FaUserShield}
        actions={[
          {
            label: 'Nuevo',
            action: isCreateUserPermission.hasPermission
              ? () => setIsOpenModal(true)
              : null,
            color: 'mycad',
            icon: IoMdAdd,
            filled: true,
          },
        ]}
      />
      <TableActions
        onRefreshData={handleRefreshData}
        handleSearchTerm={handleSearch}
        headers={columns}
      />
      {users && !isPending ? (
        users?.data?.length > 0 ? (
          <>
            <div className="hidden md:block text-nowrap">
              <Table
                columns={columns}
                sortBy={sortBy}
                sortedBy={searchFilters?.sortBy}
              >
                {users?.data?.map((user) => {
                  const formatedUser = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userName: user.userName,
                    phone: user.phone,
                    'role.name': user.role.name,
                    photo: user?.photo?.[0] ? [user.photo?.[0]] : [],
                    status: user.status,
                  };
                  return (
                    <T.Row key={user.id}>
                      {columns.map((column) =>
                        column.id === 'photo' ? (
                          <T.Cell key={column.id}>
                            {formatedUser[column.id] &&
                            formatedUser[column.id].length > 0 ? (
                              <ImageViewer
                                containerClassNames={
                                  'first:w-12 first:h-12 first:rounded-md'
                                }
                                images={formatedUser[column.id]}
                                alt={`${formatedUser.firstName} ${formatedUser.lastName}`}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-stone-200 flex justify-center items-center gap-2">
                                <span className="text-stone-500 font-bold text-2xl">
                                  {formatedUser.firstName[0] +
                                    formatedUser.lastName[0]}
                                </span>
                              </div>
                            )}
                          </T.Cell>
                        ) : column.id === 'firstName' ||
                          column.id === 'lastName' ||
                          column.id === 'email' ||
                          column.id === 'userName' ||
                          column.id === 'phone' ||
                          column.id === 'role.name' ? (
                          <T.Cell
                            className={`${column?.id === 'firstName' ? 'font-bold' : ''}`}
                            key={column.id}
                          >
                            {formatedUser[column.id]}
                          </T.Cell>
                        ) : column.id === 'status' ? (
                          <T.Cell key={column.id}>
                            <span
                              className={classNames(
                                'text-xs font-bold px-4 py-2 rounded-full',
                                formatedUser[column.id]
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white',
                              )}
                            >
                              {formatedUser[column.id] ? 'Activo' : 'Inactivo'}
                            </span>
                          </T.Cell>
                        ) : column.id === 'actions' && sesionUser ? (
                          <T.Cell key={column?.id}>
                            <div className="flex justify-center items-center gap-2">
                              <ActionButtons
                                onEdit={
                                  isEditUserPermission.hasPermission
                                    ? () => onEditUser(user)
                                    : null
                                }
                                onRemove={
                                  isRemoveUserPermission.hasPermission
                                    ? () => onRemoveUser(user.id)
                                    : null
                                }
                                extraActions={[
                                  {
                                    label: 'Cambiar contraseña',
                                    action: isEditUserPermission.hasPermission
                                      ? () => {
                                          setInitialValues({
                                            id: user.id,
                                            password: '',
                                            repeatPassword: '',
                                          });
                                          setChangePasswordModal(true);
                                        }
                                      : null,
                                    color: 'indigo',
                                    icon: FaLock,
                                  },
                                ]}
                              />
                            </div>
                          </T.Cell>
                        ) : null,
                      )}
                    </T.Row>
                  );
                })}
              </Table>
            </div>
            <div className="md:hidden flex py-2 flex-col gap-6">
              {users?.data?.map((user) => {
                const formatedUser = {
                  image: {
                    key: 'Foto',
                    value: user.photo[0] ?? [],
                  },
                  title: {
                    key: 'Nombre',
                    value: `${user.firstName} ${user.lastName}`,
                  },
                  phone: {
                    key: 'Teléfono',
                    value: user.phone,
                  },
                  subtitle: {
                    key: 'Rol',
                    value: user.role.name,
                  },
                  status: {
                    key: 'Estado',
                    value: user.status ? 'Activo' : 'Inactivo',
                  },
                  email: {
                    key: 'Correo',
                    value: user.email,
                  },
                  actions: {
                    key: 'Acciones',
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditUserPermission.hasPermission
                            ? () => onEditUser(user)
                            : null
                        }
                        onRemove={
                          isRemoveUserPermission.hasPermission
                            ? () => onRemoveUser(user.id)
                            : null
                        }
                        extraActions={[
                          {
                            label: 'Cambiar contraseña',
                            action: isEditUserPermission.hasPermission
                              ? () => {
                                  setInitialValues({
                                    id: user.id,
                                    password: '',
                                    repeatPassword: '',
                                  });
                                  setChangePasswordModal(true);
                                }
                              : null,
                            color: 'indigo',
                            icon: FaLock,
                          },
                        ]}
                      />
                    ),
                  },
                };
                return <Card key={user.id} data={formatedUser} showImage />;
              })}
            </div>
          </>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={5} className="h-10" />
      )}
      {users?.pagination && (
        <TableFooter
          pagination={users?.pagination}
          goOnNextPage={goOnNextPage}
          goOnPrevPage={goOnPrevPage}
          handleSelectChange={handleSelectChange}
          changePageSize={changePageSize}
        />
      )}
      {isOpenModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={isOpenModal}
          dismissible
          title={editMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          size={'3xl'}
          schema={editMode ? UserFormUpdateSchema : UserFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<UserFormFields editMode={editMode} roles={roles} />}
          saveLabel={editMode ? 'Actualizar' : 'Guardar'}
        />
      )}
      {changePasswordModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={changePasswordModal}
          dismissible
          title={`Cambiar contraseña de ${
            users?.data?.find((user) => user?.id === initialValues?.id)
              ?.firstName
          }
          ${
            users?.data?.find((user) => user?.id === initialValues?.id)
              ?.lastName
          }`}
          size={'xl'}
          schema={UserFormChangePasswordSchema}
          initialValues={initialValues}
          onSubmit={onChangeUserPassword}
          formFields={<UserChangePasswordFormFields />}
          saveLabel={editMode ? 'Actualizar' : 'Guardar'}
        />
      )}
      <ModalRemove
        isOpenModal={isRemoveModalOpen}
        onCloseModal={() => setIsRemoveModalOpen(false)}
        removeFunction={onConfirmRemoveUser}
      />
    </div>
  );
};

const ProtectedUserView = withPermission(Users, 'view_users');

export default ProtectedUserView;
