import React, { useCallback, useEffect, useRef, useState, lazy } from 'react';

import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineFileUpload } from 'react-icons/md';
import { Table as T } from 'flowbite-react';

import { useCatalogContext } from '../../../context/CatalogContext';
import ModalForm from '../../../components/Modals/ModalForm';
import ModalRemove from '../../../components/Modals/ModalRemove';
import { searchModels } from '../../../services/api';
import { modelColumns } from '../../../utils/CatalogsFields';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import CreateMultipleModels from './CreateMultipleModels';
import Notifies from '../../../components/Notifies/Notifies';
import ModelFormFields from '../../../components/VehicleComponents/ModelForm/ModelFormFields';
import ModalFormikForm from '../../../components/Modals/ModalFormikForm';
import { ModelFormSchema } from '../../../components/VehicleComponents/ModelForm/ModelFormSchema';
import { HiCubeTransparent } from 'react-icons/hi';
import withPermission from '../../../utils/withPermissions';
import useCheckPermissions from '../../../hooks/useCheckPermissions';
const Card = lazy(() => import('../../../components/Card/Card'));
const TableHeader = lazy(() => import('../../../components/Table/TableHeader'));
const TableFooter = lazy(() => import('../../../components/Table/TableFooter'));
const TableActions = lazy(
  () => import('../../../components/Table/TableActions'),
);
const TableResultsNotFound = lazy(
  () => import('../../../components/Table/TableResultsNotFound'),
);
const Table = lazy(() => import('../../../components/Table/Table'));

const Models = () => {
  const {
    vehicleBrands,
    vehicleTypes,
    createVehicleModel,
    updateVehicleModel,
    deleteVehicleModel,
  } = useCatalogContext();
  const [columns, setColumns] = useState([...modelColumns]);
  const lastChange = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [createMultipleModelsModal, setCreateMultipleModelsModal] =
    useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteModelId, setDeleteModelId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    brandId: '',
    typeId: '',
    year: '',
    id: '',
  });
  // const [vehicleId, setVehicleId] = useState(null);
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
    data: models,
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ['models', { ...searchFilters }],
    queryFn: ({ signal }) => searchModels({ ...searchFilters, signal }),
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

  const onEditModel = (model) => {
    setEditMode(true);
    setInitialValues({
      id: model.id,
      name: model.name,
      brandId: model.brandId,
      typeId: model.typeId,
      year: parseInt(model.year, 10),
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode
        ? await updateVehicleModel(values)
        : await createVehicleModel(values);
      setSubmitting(false);
      resetForm();
      setEditMode(false);
      setInitialValues({
        id: '',
        name: '',
        brandId: '',
        typeId: '',
        year: '',
      });
      setIsOpenModal(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      id: '',
      name: '',
      brandId: '',
      typeId: '',
      year: '',
    });
  };

  const onDeleteModel = (id) => {
    setDeleteModelId(id);
    setIsRemoveModalOpen(true);
  };

  const handleRemoveModel = async () => {
    try {
      await deleteVehicleModel(deleteModelId);
      setIsRemoveModalOpen(false);
      setDeleteModelId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefreshData = () => {
    setRefreshData(true);
    Notifies('success', 'Datos actualizados correctamente');
  };

  const isEditpermissions = useCheckPermissions('edit_vehicles_models');
  const isCreatepermissions = useCheckPermissions('create_vehicles_models');
  const isDeletepermissions = useCheckPermissions('delete_vehicles_models');
  return (
    <div className="flex min-h-[77dvh] h-full flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        icon={HiCubeTransparent}
        title={'Modelos'}
        actions={[
          {
            label: 'Cargar',
            action: isCreatepermissions.hasPermission
              ? () => setCreateMultipleModelsModal(true)
              : null,
            color: 'blue',
            icon: MdOutlineFileUpload,
          },
          {
            label: 'Nuevo',
            action: isCreatepermissions.hasPermission
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
      {models && !isPending ? (
        models?.data?.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Table
                columns={columns}
                sortBy={sortBy}
                sortedBy={searchFilters.sortBy}
              >
                {models &&
                  !isPending &&
                  models?.data?.map((model) => {
                    return (
                      <T.Row key={model.id}>
                        {columns.map((column) => {
                          let cellValue;
                          if (column.id === 'model') {
                            cellValue = model.name;
                          } else if (column.id === 'brand.name') {
                            cellValue = model.brand?.name;
                          } else if (column.id === 'type.name') {
                            cellValue = `${model.type?.economicGroup || ''} ${model.type?.name || ''}`;
                          } else if (column.id === 'year') {
                            cellValue = model.year;
                          }

                          if (cellValue !== undefined) {
                            return (
                              <T.Cell
                                className={`${column?.id === 'model' ? 'font-bold' : ''}`}
                                key={column.id}
                              >
                                {cellValue}
                              </T.Cell>
                            );
                          }

                          return (
                            <T.Cell key={column?.id}>
                              <div className="flex justify-center items-center gap-2">
                                <ActionButtons
                                  onEdit={
                                    isEditpermissions.hasPermission
                                      ? () => onEditModel(model)
                                      : null
                                  }
                                  onRemove={
                                    isDeletepermissions.hasPermission
                                      ? () => onDeleteModel(model.id)
                                      : null
                                  }
                                />
                              </div>
                            </T.Cell>
                          );
                        })}
                      </T.Row>
                    );
                  })}
              </Table>
            </div>
            <div className="md:hidden py-2 flex flex-col gap-6">
              {models?.data?.map((model, index) => {
                const parseModel = {
                  model: {
                    key: 'Modelo',
                    value: model.name,
                  },
                  brand: {
                    key: 'Marca',
                    value: model.brand.name,
                  },
                  type: {
                    key: 'Tipo',
                    value: `(${model.type.economicGroup}) ${model.type.name}`,
                  },
                  year: {
                    key: 'Año',
                    value: model.year,
                  },
                  actions: {
                    key: 'Acciones',
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditpermissions.hasPermission
                            ? () => onEditModel(model)
                            : null
                        }
                        onRemove={
                          isDeletepermissions.hasPermission
                            ? () => onDeleteModel(model.id)
                            : null
                        }
                      />
                    ),
                  },
                };
                return <Card key={model.id} data={parseModel} />;
              })}
            </div>
          </>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={10} className="h-10" />
      )}
      {models?.pagination && (
        <TableFooter
          pagination={models?.pagination}
          goOnNextPage={goOnNextPage}
          goOnPrevPage={goOnPrevPage}
          handleSelectChange={handleSelectChange}
          changePageSize={changePageSize}
        />
      )}
      {isOpenModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          size={'2xl'}
          isOpenModal={isOpenModal}
          dismissible
          title={editMode ? 'Editar Modelo' : 'Crear Modelo'}
          schema={ModelFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={
            <ModelFormFields
              vehicleBrands={vehicleBrands}
              vehicleTypes={vehicleTypes?.map((type) => {
                return {
                  ...type,
                  name: `${type.economicGroup} ${type.name}`,
                };
              })}
            />
          }
          saveLabel={editMode ? 'Actualizar' : 'Guardar'}
        />
      )}
      {isRemoveModalOpen && (
        <ModalRemove
          isOpenModal={isRemoveModalOpen}
          onCloseModal={() => setIsRemoveModalOpen(false)}
          removeFunction={handleRemoveModel}
        />
      )}
      {createMultipleModelsModal && (
        <ModalForm
          onClose={() => setCreateMultipleModelsModal(false)}
          title="Cargar múltiples modelos"
          isOpenModal={createMultipleModelsModal}
        >
          <CreateMultipleModels />
        </ModalForm>
      )}
    </div>
  );
};

const ProtectedModels = withPermission(Models, 'view_vehicles_models');

export default ProtectedModels;
