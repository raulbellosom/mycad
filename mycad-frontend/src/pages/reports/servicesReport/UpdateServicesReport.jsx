import React, { useRef, useEffect, useState } from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';
import { useReports } from '../../../hooks/useReports';
import ServicesForm from '../../../components/Reports/ServicesForm/ServicesForm';
import { useVehicleContext } from '../../../context/VehicleContext';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { FaEye, FaSave } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import withPermission from '../../../utils/withPermissions';

const UpdateServicesReport = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID del reporte desde la URL
  const formRef = useRef(null);
  const { modifyReport, fetchReportById, state } = useReports();
  const { vehicles, fetchVehicles } = useVehicleContext();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchVehicles();
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  useEffect(() => {
    if (state.report && state.report.vehicleId) {
      const parseAttachments = state?.report?.attachments?.map(
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
        vehicleId: state.report.vehicleId,
        reportType: state.report.reportType,
        serviceDate: state.report.serviceDate
          ? new Date(state.report.serviceDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        endServiceDate: state.report.endServiceDate
          ? new Date(state.report.endServiceDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        serviceProviderName: state.report.serviceProviderName,
        serviceContactInfo: state.report.serviceContactInfo,
        description: state.report.description,
        totalCost: state.report.totalCost,
        comments: state.report.comments,
        replacedParts: state.report.replacedParts,
        attachments: parseAttachments,
      });
    }
  }, [state.report]);

  // Manejar el envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    modifyReport.mutateAsync(
      { id, data: values },
      {
        onSuccess: () => {
          resetForm();
          setSubmitting(false);
          navigate('/reports/services/view/' + id);
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
    navigate('/reports/services');
  };

  return (
    <section className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 pb-10 antialiased">
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center gap-4 w-full pb-1">
        <div className="h-full rounded-md flex items-center text-orange-500">
          <MdMiscellaneousServices size={24} className="mr-4" />
          <h1 className="text-2xl font-bold">Editar Reporte</h1>
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
                href: '/reports/services/view/' + id,
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
        <ServicesForm
          ref={formRef}
          initialValues={{
            vehicleId: report?.vehicleId || '',
            reportType: report?.reportType || '',
            serviceDate: report?.serviceDate || '',
            endServiceDate: report?.endServiceDate || '',
            serviceProviderName: report?.serviceProviderName || '',
            serviceContactInfo: report?.serviceContactInfo || '',
            description: report?.description || '',
            totalCost: report?.totalCost || '',
            comments: report?.comments || '',
            replacedParts: report?.replacedParts || [],
            attachments: report?.attachments || [],
          }}
          onSubmit={handleSubmit}
          vehicles={vehicles}
        />
      </div>
    </section>
  );
};

const ProtectedUpdateServiceReportView = withPermission(
  UpdateServicesReport,
  'edit_services_reports',
);

export default ProtectedUpdateServiceReportView;
