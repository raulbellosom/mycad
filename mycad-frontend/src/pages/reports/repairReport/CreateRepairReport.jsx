import React, { useRef, useEffect } from 'react';
import { MdBuild } from 'react-icons/md'; // Cambié el ícono para diferenciarlo
import { useRepairReports } from '../../../hooks/useRepairReports'; // Usar el hook correcto
import RepairForm from '../../../components/Reports/RepairForm/RepairForm'; // Usar el formulario correcto
import { useVehicleContext } from '../../../context/VehicleContext';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { FaSave, FaToolbox } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import withPermission from '../../../utils/withPermissions';

const CreateRepairReport = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { createNewRepairReport } = useRepairReports(); // Usar la mutación correcta
  const { vehicles, fetchVehicles } = useVehicleContext();

  // Valores iniciales del formulario
  const initialValues = {
    vehicleId: '',
    failureDate: '',
    startRepairDate: '',
    repairDate: '',
    description: '',
    totalCost: '',
    comments: '',
    repairedParts: [], // Cambié el nombre para reflejar el campo de reparación
    attachments: [],
    workshopType: 'IN_HOUSE',
    workshopName: '',
    workshopContact: '',
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    createNewRepairReport.mutate(values, {
      onSuccess: () => {
        resetForm();
        setSubmitting(false);
        navigate('/reports/repairs'); // Cambié la ruta
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
    navigate('/reports/repairs'); // Cambié la ruta
  };

  return (
    <>
      <section className="mx-auto container flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full pb-1">
          <div className="w-full h-full rounded-md flex items-center text-orange-500">
            <FaToolbox size={24} className="mr-4" />
            <h1 className="text-lg md:text-2xl font-bold">
              Crear Reporte de Reparación
            </h1>
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
          <RepairForm
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

const ProtectedCreateRepairReportView = withPermission(
  CreateRepairReport,
  'create_repairs_reports',
);

export default ProtectedCreateRepairReportView;
