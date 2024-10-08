import React, { useEffect, useState } from 'react';
import { useCatalogContext } from '../../../context/CatalogContext';
import CatalogList from '../../../components/VehicleComponents/CatalogList';
import ModalForm from '../../../components/Modals/ModalForm';
import ModalRemove from '../../../components/Modals/ModalRemove';
const BrandForm = React.lazy(
  () => import('../../../components/VehicleComponents/BrandForm/BrandForm'),
);

const Brands = () => {
  const {
    vehicleBrands,
    createVehicleBrand,
    updateVehicleBrand,
    deleteVehicleBrand,
    loading,
  } = useCatalogContext();

  const [brands, setBrands] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [removeBrandId, setRemoveBrandId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    id: '',
    count: 0,
  });

  useEffect(() => {
    const formattedBrands = vehicleBrands.map((brand) => {
      return {
        id: brand.id,
        name: brand.name,
        count: brand.count,
      };
    });
    setBrands(formattedBrands);
  }, [vehicleBrands]);

  const onEditBrand = (brand) => {
    setEditMode(true);
    setInitialValues({
      id: brand.id,
      name: brand.name,
      count: brand.count,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode
        ? await updateVehicleBrand(values)
        : await createVehicleBrand(values);
      setSubmitting(false);
      resetForm();
      setInitialValues({
        name: '',
        id: '',
        count: 0,
      });
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const handleDeleteVehicleBrand = async () => {
    try {
      await deleteVehicleBrand(removeBrandId);
      setIsDeleteModalOpen(false);
      setRemoveBrandId(null);
    } catch (error) {
      console.log(error);
      setIsDeleteModalOpen(false);
    }
  };

  const onCloseModal = () => {
    setEditMode(false);
    setInitialValues({
      name: '',
      id: '',
      count: 0,
    });
    setIsOpenModal(false);
  };

  const onRemoveBrand = (id) => {
    setRemoveBrandId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="w-full h-full">
      {brands && brands.length > 0 && !loading ? (
        <CatalogList
          data={brands}
          title="Marcas de Vehiculos"
          onCreate={() => setIsOpenModal(true)}
          position="center"
          onEdit={(type) => onEditBrand(type)}
          onRemove={(type) => onRemoveBrand(type.id)}
        />
      ) : (
        <CatalogList.Skeleton />
      )}
      <ModalForm
        onClose={onCloseModal}
        isOpenModal={isOpenModal}
        title={
          editMode
            ? 'Editar Marca de Vehiculos'
            : 'Agregar Nueva Marca de Vehiculos'
        }
      >
        <BrandForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isUpdate={editMode}
        />
      </ModalForm>
      <ModalRemove
        isOpenModal={isDeleteModalOpen}
        onCloseModal={() => setIsDeleteModalOpen(false)}
        removeFunction={handleDeleteVehicleBrand}
      />
    </div>
  );
};

export default Brands;
