import React, { useRef, useEffect, useState } from 'react';
import { MdBuild } from 'react-icons/md';
import { useRepairReports } from '../../../hooks/useRepairReports';
import RepairForm from '../../../components/Reports/RepairForm/RepairForm';
import { useVehicleContext } from '../../../context/VehicleContext';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { FaEye, FaSave, FaToolbox } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateRepairReport = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID del reporte desde la URL
  const formRef = useRef(null);
  const { modifyRepairReport, fetchRepairReportById, state } =
    useRepairReports();
  const { vehicles, fetchVehicles } = useVehicleContext();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchVehicles();
    if (id) {
      fetchRepairReportById(id);
    }
  }, [id]);

  useEffect(() => {
    if (state.repairReport && state.repairReport.vehicleId) {
      const parseAttachments = state?.repairReport?.attachments?.map(
        (attachment) => ({
          id: attachment.id,
          url: attachment.url,
          type: attachment.type,
          name:
            JSON?.parse(attachment?.metadata)?.originalName ||
            'Archivo desconocido',
        }),
      );

      setReport({
        vehicleId: state.repairReport.vehicleId,
        failureDate: state.repairReport.failureDate
          ? new Date(state.repairReport.failureDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        startRepairDate: state.repairReport.startRepairDate
          ? new Date(state.repairReport.startRepairDate)
              .toISOString()
              .split('T')[0]
          : new Date().toISOString().split('T')[0],
        repairDate: state.repairReport.repairDate
          ? new Date(state.repairReport.repairDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        description: state.repairReport.description,
        totalCost: state.repairReport.totalCost,
        comments: state.repairReport.comments,
        repairedParts: state.repairReport.repairedParts,
        attachments: parseAttachments,
        workshopType: state.repairReport.workshopType || 'IN_HOUSE',
        workshopName: state.repairReport.workshopName || '',
        workshopContact: state.repairReport.workshopContact || '',
      });
    }
  }, [state.repairReport]);

  // Manejar el envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    modifyRepairReport.mutateAsync(
      { id, data: values },
      {
        onSuccess: () => {
          resetForm();
          setSubmitting(false);
          navigate('/reports/repairs/view/' + id);
        },
        onError: () => {
          setSubmitting(false);
        },
      },
    );
  };

  const handleSubmitRef = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const onCancel = () => {
    navigate('/reports/repairs');
  };

  return (
    <section className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 pb-10 antialiased">
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center gap-4 w-full pb-1">
        <div className="h-full rounded-md flex items-center text-orange-500">
          <FaToolbox size={24} className="mr-4" />
          <h1 className="text-lg md:text-2xl font-bold">
            Editar Reporte de Reparación
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
                label: 'Ver reporte',
                href: '/reports/repairs/view/' + id,
                color: 'blue',
                icon: FaEye,
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
          initialValues={{
            vehicleId: report?.vehicleId || '',
            repairDate: report?.repairDate || '',
            failureDate: report?.failureDate || '',
            startRepairDate: report?.startRepairDate || '',
            description: report?.description || '',
            totalCost: report?.totalCost || '',
            comments: report?.comments || '',
            repairedParts: report?.repairedParts || [],
            attachments: report?.attachments || [],
            workshopType: report?.workshopType || 'IN_HOUSE',
            workshopName: report?.workshopName || '',
            workshopContact: report?.workshopContact || '',
          }}
          onSubmit={handleSubmit}
          vehicles={vehicles}
        />
      </div>
    </section>
  );
};

export default UpdateRepairReport;
