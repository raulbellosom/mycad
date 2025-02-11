import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import { IoMdAdd } from 'react-icons/io';
import { Table as T } from 'flowbite-react';
import ModalRemove from '../../components/Modals/ModalRemove';
import { searchClients } from '../../services/rentals.api';
import clientsColumns from '../../utils/clientsColumns';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import Notifies from '../../components/Notifies/Notifies';
import { useAuthContext } from '../../context/AuthContext';
import { FaUserShield } from 'react-icons/fa';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import { ClientsFormSchema } from '../../components/Clients/ClientsFormSchema';
import ClientsFormFields from '../../components/Clients/ClientsFormFields';
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
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';
import { useClients } from '../../hooks/useClients';

const Clients = () => {
  const lastChange = useRef();
  const { user: sesionUser } = useAuthContext();

  // Extraemos los métodos del hook de Clients
  const { createNewClient, modifyClient, removeClient } = useClients();

  const [columns, setColumns] = useState(clientsColumns);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    company: '',
    email: '',
    phoneNumber: '',
  });
  const [refreshData, setRefreshData] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    pageSize: 5,
    page: currentPageNumber,
    sortBy: 'createdAt',
    order: 'desc',
  });

  const {
    data: clients,
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ['clients', searchFilters],
    queryFn: ({ signal }) => searchClients(searchFilters, signal),
    staleTime: Infinity,
  });

  useEffect(() => {
    refetch();
    setRefreshData(false);
  }, [searchFilters, refreshData, refetch]);

  const goOnPrevPage = useCallback(() => {
    setSearchFilters((prevState) => ({
      ...prevState,
      page: prevState.page - 1,
    }));
  }, []);

  const goOnNextPage = useCallback(() => {
    setSearchFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  }, []);

  const handleSelectChange = useCallback((page) => {
    setSearchFilters((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }
    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setSearchFilters((prevState) => ({
        ...prevState,
        searchTerm: e.target.value,
      }));
    }, 600);
  }, []);

  const changePageSize = (e) => {
    setSearchFilters((prevState) => ({
      ...prevState,
      limit: parseInt(e.target.value, 10), // asegúrate de convertir a número
    }));
  };

  const sortBy = (column) => {
    const selectedHeaderIndex = columns.findIndex((col) => col.id === column);
    let updatedHeaders = [];
    if (selectedHeaderIndex !== -1) {
      const selectedHeader = columns[selectedHeaderIndex];
      const updatedHeader = {
        ...selectedHeader,
        order: selectedHeader.order === 'asc' ? 'desc' : 'asc',
      };
      updatedHeaders = [...columns];
      updatedHeaders[selectedHeaderIndex] = updatedHeader;
      setSearchFilters((prevState) => ({
        ...prevState,
        sortBy: column,
        order: updatedHeader.order,
      }));
    }
    setColumns(updatedHeaders);
  };

  const handleRefreshData = () => {
    setRefreshData(true);
    Notifies('success', 'Datos actualizados correctamente');
  };

  const onEditClient = (item) => {
    setEditMode(true);
    setInitialValues({
      id: item.id,
      name: item.name,
      company: item.company,
      email: item.email,
      phoneNumber: item.phoneNumber,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await modifyClient(values) : await createNewClient(values);
      setSubmitting(false);
      resetForm();
      setInitialValues({
        name: '',
        company: '',
        email: '',
        phoneNumber: '',
      });
      setEditMode(false);
      setIsOpenModal(false);
    } catch (err) {
      console.error('Error on submit create or edit client', err);
      Notifies('error', 'Error al guardar el cliente');
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      name: '',
      company: '',
      email: '',
      phoneNumber: '',
    });
  };

  const onRemoveClient = (id) => {
    setDeleteClientId(id);
    setIsRemoveModalOpen(true);
  };

  const onConfirmRemoveClient = async () => {
    try {
      await removeClient(deleteClientId);
      setIsRemoveModalOpen(false);
      setDeleteClientId(null);
    } catch (err) {
      console.error('Error on remove client', err);
      Notifies('error', 'Error al eliminar el cliente');
    }
  };

  // Permisos
  const isCreateClientPermission = useCheckPermissions('create_clients');
  const isEditClientPermission = useCheckPermissions('edit_clients');
  const isRemoveClientPermission = useCheckPermissions('delete_clients');

  return (
    <div className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        title={'Clientes'}
        icon={FaUserShield}
        actions={[
          {
            label: 'Nuevo',
            action: isCreateClientPermission.hasPermission
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
      {clients && !isPending ? (
        clients.data.length > 0 ? (
          <>
            <div className="hidden md:block text-nowrap">
              <Table
                columns={columns}
                sortBy={sortBy}
                sortedBy={searchFilters.sortBy}
              >
                {clients.data.map((client) => {
                  const formatedClient = {
                    name: client.name,
                    company: client.company,
                    email: client.email,
                    phoneNumber: client.phoneNumber,
                  };
                  return (
                    <T.Row key={client.id}>
                      {columns.map((column) => {
                        if (
                          column.id === 'name' ||
                          column.id === 'company' ||
                          column.id === 'email' ||
                          column.id === 'phoneNumber'
                        ) {
                          return (
                            <T.Cell
                              key={column.id}
                              className={
                                column.id === 'name' ? 'font-bold' : ''
                              }
                            >
                              {formatedClient[column.id]}
                            </T.Cell>
                          );
                        } else if (column.id === 'actions' && sesionUser) {
                          return (
                            <T.Cell key={column.id}>
                              <div className="flex justify-center items-center gap-2">
                                <ActionButtons
                                  onEdit={
                                    isEditClientPermission.hasPermission
                                      ? () => onEditClient(client)
                                      : null
                                  }
                                  onRemove={
                                    isRemoveClientPermission.hasPermission
                                      ? () => onRemoveClient(client.id)
                                      : null
                                  }
                                />
                              </div>
                            </T.Cell>
                          );
                        }
                        return null;
                      })}
                    </T.Row>
                  );
                })}
              </Table>
            </div>
            <div className="md:hidden flex py-2 flex-col gap-6">
              {clients.data.map((client) => {
                const formatedClient = {
                  title: {
                    key: 'Nombre',
                    value: client.name,
                  },
                  subtitle: {
                    key: 'Compañía',
                    value: client.company,
                  },
                  phone: {
                    key: 'Teléfono',
                    value: client.phoneNumber,
                  },
                  email: {
                    key: 'Correo',
                    value: client.email,
                  },
                  actions: {
                    key: 'Acciones',
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditClientPermission.hasPermission
                            ? () => onEditClient(client)
                            : null
                        }
                        onRemove={
                          isRemoveClientPermission.hasPermission
                            ? () => onRemoveClient(client.id)
                            : null
                        }
                      />
                    ),
                  },
                };
                return <Card key={client.id} data={formatedClient} />;
              })}
            </div>
          </>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={5} className="h-10" />
      )}
      {clients?.pagination && (
        <TableFooter
          pagination={clients.pagination}
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
          title={editMode ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
          size={'3xl'}
          schema={ClientsFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<ClientsFormFields editMode={editMode} />}
          saveLabel={editMode ? 'Actualizar' : 'Guardar'}
        />
      )}
      <ModalRemove
        isOpenModal={isRemoveModalOpen}
        onCloseModal={() => setIsRemoveModalOpen(false)}
        removeFunction={onConfirmRemoveClient}
      />
    </div>
  );
};

const ProtectedClientsView = withPermission(Clients, 'view_clients');

export default ProtectedClientsView;
