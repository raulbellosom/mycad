import React, { useEffect, useRef, useState } from 'react';
import RentalForm from '../../components/Rentals/RentalForm';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { FaFileInvoiceDollar, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import withPermission from '../../utils/withPermissions';
import { useVehicleContext } from '../../context/VehicleContext';
import { useClients } from '../../hooks/useClients';
import { useRentals } from '../../hooks/useRentals';
import { MdCancel } from 'react-icons/md';

const CreateRental = () => {
  const formRef = useRef(null);
  const { createNewRental } = useRentals();
  const { vehicles } = useVehicleContext();
  const { state } = useClients();
  const { clients } = state;
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const rental = await createNewRental(values);
      setSubmitting(false);
      resetForm();
      navigate(`/rentals/view/${rental.id}`);
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

  return (
    <div className="h-full bg-white p-4 rounded-md">
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full pb-1">
        <div className="w-full h-full rounded-md flex items-center text-orange-500">
          <FaFileInvoiceDollar size={24} className="mr-4" />
          <h1 className="text-2xl font-bold">Crear Renta</h1>
        </div>
        <div className="flex justify-center gap-2">
          <ActionButtons
            extraActions={[
              {
                label: 'Cancelar',
                action: onCancel,
                color: 'red',
                icon: MdCancel,
              },
              {
                label: 'Guardar',
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
        Llena el formulario para crear una nueva renta. Los campos marcados con
        * son obligatorios.
      </p>
      <RentalForm
        ref={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        vehicles={vehicles}
        clients={clients}
      />
    </div>
  );
};

const ProtectedCreateRental = withPermission(CreateRental, 'create_rentals');

export default ProtectedCreateRental;
