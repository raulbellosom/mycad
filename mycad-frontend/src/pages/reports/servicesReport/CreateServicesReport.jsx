import React, { useRef, useEffect } from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';
import { useReports } from '../../../hooks/useReports';
import ServicesForm from '../../../components/Reports/ServicesForm/ServicesForm';
import { useVehicleContext } from '../../../context/VehicleContext';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { FaSave } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const CreateServicesReport = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { createNewReport } = useReports();
  const { vehicles, fetchVehicles } = useVehicleContext();

  // Valores iniciales del formulario
  const initialValues = {
    vehicleId: '',
    reportType: '',
    serviceDate: '',
    endServiceDate: '',
    serviceProviderName: '',
    serviceContactInfo: '',
    description: '',
    totalCost: '',
    comments: '',
    replacedParts: [],
    attachments: [],
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    createNewReport.mutate(values, {
      onSuccess: () => {
        resetForm();
        setSubmitting(false);
        navigate('/reports/services');
      },
      onError: () => {
        Notifies('error', 'Error al crear el reporte');
        setSubmitting(false);
      },
    });
  };

  const handleSubmitRef = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const onCancel = () => {
    navigate('/reports/services');
  };

  return (
    <>
      <section className="mx-auto container flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full pb-1">
          <div className="w-full h-full rounded-md flex items-center text-orange-500">
            <MdMiscellaneousServices size={24} className="mr-4" />
            <h1 className="text-2xl font-bold">Crear Reporte</h1>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <ActionButtons
              extraActions={[
                {
                  label: 'Cancelar',
                  action: onCancel,
                  color: 'red',
                  icon: IoMdArrowRoundBack,
                },
                {
                  label: 'Guardar',
                  action: handleSubmitRef,
                  icon: FaSave,
                  color: 'mycad',
                  filled: true,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <ServicesForm
            ref={formRef}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            vehicles={vehicles}
          />
        </div>
      </section>
    </>
  );
};

export default CreateServicesReport;
