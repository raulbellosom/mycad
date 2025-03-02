import React, { useEffect, useRef, useState } from 'react';
import RentalForm from '../../components/Rentals/RentalForm';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { FaFileInvoiceDollar, FaSave, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import withPermission from '../../utils/withPermissions';
import { useVehicleContext } from '../../context/VehicleContext';
import { useClients } from '../../hooks/useClients';
import { useRentals } from '../../hooks/useRentals';
import { MdArrowBack } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getRentalById } from '../../services/rentals.api';
import ModalRemove from '../../components/Modals/ModalRemove';

const UpdateRental = () => {
  const formRef = useRef(null);
  const { id } = useParams();
  const { modifyRental, removeRental } = useRentals();
  const { vehicles } = useVehicleContext();
  const { state } = useClients();
  const { clients } = state;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    vehicleId: '',
    clientId: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    returnDate: '',
    dailyRate: '',
    deposit: '',
    totalCost: '',
    paymentStatus: 'PENDING',
    initialMileage: '',
    finalMileage: '',
    fuelLevelStart: '',
    fuelLevelEnd: '',
    comments: '',
    status: 'PENDING',
    files: [],
  });

  const {
    data: rental,
    refetch,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ['rental', id],
    queryFn: ({ signal }) => getRentalById({ id, signal }),
  });

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  useEffect(() => {
    if (rental) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatedFiles = rental?.files?.map((file) => {
        const metadata = file.metadata ? JSON.parse(file.metadata) : {};

        const originalName = metadata.originalName || file.id;

        return {
          id: file.id,
          url: file.url,
          type: file.type,
          name: originalName,
        };
      });

      setInitialValues((prevValues) => ({
        ...prevValues,
        vehicleId: rental.vehicleId,
        clientId: rental.clientId,
        startDate: formatDate(rental.startDate),
        endDate: formatDate(rental.endDate),
        pickupLocation: rental.pickupLocation || '',
        dropoffLocation: rental.dropoffLocation || '',
        pickupDate: formatDate(rental.pickupDate) || '',
        returnDate: formatDate(rental.returnDate) || '',
        dailyRate: rental.dailyRate || '',
        deposit: rental.deposit || '',
        totalCost: rental.totalCost || '',
        paymentStatus: rental.paymentStatus || 'PENDING',
        initialMileage: rental.initialMileage || '',
        finalMileage: rental.finalMileage || '',
        fuelLevelStart: rental.fuelLevelStart || '',
        fuelLevelEnd: rental.fuelLevelEnd || '',
        comments: rental.comments || '',
        status: rental.status || 'PENDING',
        files: formatedFiles || [],
      }));
    }
  }, [rental]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const existingFiles = values.files
        .filter((file) => file && file.id) // Eliminar nulls y objetos vacíos
        .map((file) => file.id);

      await modifyRental({
        id,
        values: { ...values, existingFiles: JSON.stringify(existingFiles) },
      });

      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const onCancel = () => {
    navigate('/rentals');
  };

  const handleSubmitRef = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const onRemove = () => {
    setIsOpenModal(true);
  };

  const handleDeleteVehicle = async () => {
    await removeRental(id);
    navigate('/rentals');
  };

  return (
    <>
      <div className="h-full bg-white p-4 rounded-md">
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full pb-1">
          <div className="w-full h-full rounded-md flex items-center text-orange-500">
            <FaFileInvoiceDollar size={24} className="mr-4" />
            <h1 className="text-2xl font-bold">Actualizar Renta</h1>
          </div>
          <div className="flex justify-center gap-2">
            <ActionButtons
              extraActions={[
                {
                  label: 'Volver',
                  action: onCancel,
                  color: 'red',
                  icon: MdArrowBack,
                },
                {
                  label: 'Eliminar',
                  action: onRemove,
                  color: 'red',
                  icon: FaTrashAlt,
                },
                {
                  label: 'Actualizar',
                  action: handleSubmitRef,
                  icon: FaSave,
                  color: 'green',
                },
              ]}
              labelCancel={'Descartar'}
            />
          </div>
        </div>
        <p className="mb-4 text-gray-800">
          Llena el formulario para crear una nueva renta. Los campos marcados
          con * son obligatorios.
        </p>
        {!isPending && (
          <RentalForm
            ref={formRef}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            vehicles={vehicles}
            clients={clients}
          />
        )}
      </div>
      {isOpenModal && (
        <ModalRemove
          isOpenModal={isOpenModal}
          onCloseModal={() => setIsOpenModal(false)}
          removeFunction={handleDeleteVehicle}
        />
      )}
    </>
  );
};

const ProtectedUpdateRental = withPermission(UpdateRental, 'create_rentals');

export default ProtectedUpdateRental;
