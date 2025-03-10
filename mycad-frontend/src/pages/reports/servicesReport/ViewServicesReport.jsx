import React, { useEffect, useState } from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useReports } from '../../../hooks/useReports';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCarSide,
  FaFilePdf,
  FaPen,
} from 'react-icons/fa';
import Logo from '../../../assets/logo/myc_logo.png';
import { parseToCurrency } from '../../../utils/formatValues';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import FileIcon from '../../../components/FileIcon/FileIcon';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BiSolidCarGarage, BiSolidContact } from 'react-icons/bi';
import withPermission from '../../../utils/withPermissions';

const ViewServicesReport = () => {
  const { id } = useParams();
  const { fetchReportById, state } = useReports();
  const [report, setReport] = useState({});

  useEffect(() => {
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  useEffect(() => {
    if (state.report && state.report.vehicleId) {
      const parseAttachments = state.report.attachments.map((attachment) => ({
        id: attachment.id,
        url: attachment.url,
        type: attachment.type,
        name:
          JSON?.parse(attachment?.metadata)?.originalName ||
          'Archivo desconocido',
      }));
      setReport({
        ...state.report,
        attachments: parseAttachments,
      });
    }
  }, [state.report]);

  const exportToPDF = async () => {
    const element = document.getElementById('pdf-container'); // ID del contenedor
    const canvas = await html2canvas(element, {
      scale: 2, // Escala para menor tamaño
      useCORS: true, // Permite cargar imágenes externas
      backgroundColor: '#ffffff', // Forzar fondo blanco
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Usa JPEG con calidad del 80%
    const pdf = new jsPDF('portrait', 'mm', 'letter');

    // Dimensiones del PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Agrega la imagen al PDF con compresión
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

    // Descarga el PDF
    pdf.save(`Reporte_${report.folio || 'sin_folio'}.pdf`);
  };

  return (
    <section className="flex flex-col bg-white shadow-md rounded-md dark:bg-gray-900 p-2 md:p-6 antialiased">
      {/* Encabezado */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full pb-4">
        <div className="w-full h-full flex items-center text-orange-500">
          <MdMiscellaneousServices size={24} className="mr-4" />
          <h1 className="md:text-2xl font-bold">
            Reporte de{' '}
            {report.reportType === 'PREVENTIVE' ? 'Mantenimiento' : 'Servicio'}
          </h1>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <ActionButtons
            extraActions={[
              {
                label: 'Regresar',
                href: '/reports/services',
                color: 'black',
                icon: IoMdArrowRoundBack,
              },
              {
                label: 'PDF',
                action: exportToPDF,
                icon: FaFilePdf,
                color: 'danger',
              },
              {
                label: 'Editar',
                href: `/reports/services/edit/${id}`,
                icon: FaPen,
                color: 'mycad',
                filled: true,
              },
            ]}
          />
        </div>
      </div>

      {/* Detalles del reporte */}
      <div
        id="pdf-container"
        className="mt-2 w-full max-w-4xl flex justify-center flex-col gap-2 mx-auto border p-2 md:p-8 rounded-lg"
      >
        <div className="flex flex-col  md:flex-row justify-between md:items-center gap-4">
          <div className="flex justify-center md:justify-start md:mb-2">
            <img
              src={Logo}
              alt="Company Logo"
              className="h-16 object-contain"
            />
          </div>
          <div className="text-center">
            <h2 className="md:text-xl font-bold">
              Detalles del{' '}
              {report.reportType === 'PREVENTIVE'
                ? 'mantenimiento'
                : 'servicio'}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Detalles del mantenimiento o servicio realizado al vehículo
            </p>
          </div>
          <div className="flex flex-col gap-2 col-span-6 md:col-span-3">
            <h3 className="text-gray-700 font-bold text-sm">FOLIO</h3>
            <p className="bg-gray-50 text-mycad-secondary p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
              <span className="inline-block">
                <AiOutlineFieldNumber size={20} />
              </span>
              {report.folio || 'No disponible'}
            </p>
          </div>
        </div>
        {report ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="flex flex-col gap-2 col-span-12 md:col-span-6">
                <h3 className="text-gray-700 font-bold text-sm">Vehículo</h3>
                <p className="bg-gray-50 p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
                  <span className="inline-block">
                    <FaCarSide size={20} />
                  </span>
                  {`(${report.vehicle?.model?.year || 'No disponible'}) ${report.vehicle?.model?.name} [${report.vehicle?.model?.brand?.name} / ${report.vehicle?.model?.type?.name}]`}
                </p>
              </div>
              <div className="flex flex-col gap-2 col-span-6 md:col-span-3">
                <h3 className="text-gray-700 font-bold text-sm">
                  Inicio del servicio
                </h3>
                <p className="bg-gray-50 p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
                  <span className="inline-block">
                    <FaCalendarAlt size={20} />
                  </span>
                  {new Date(report.serviceDate).toLocaleDateString('es-MX')}
                </p>
              </div>
              <div className="flex flex-col gap-2 col-span-6 md:col-span-3">
                <h3 className="text-gray-700 font-bold text-sm">
                  Fin del servicio
                </h3>
                <p className="bg-gray-50  p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
                  <span className="inline-block">
                    <FaCalendarCheck size={20} />
                  </span>
                  {new Date(report.endServiceDate).toLocaleDateString(
                    'es-MX',
                  ) || 'No disponible'}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full gap-2">
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-gray-700 font-bold text-sm">
                  Proveedor del{' '}
                  {report.reportType === 'PREVENTIVE'
                    ? 'mantenimiento'
                    : 'servicio'}
                </h3>
                <p className="bg-gray-50 p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
                  <span className="inline-block">
                    <BiSolidCarGarage size={20} />
                  </span>
                  {report.serviceProviderName || 'No disponible'}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-gray-700 font-bold text-sm">
                  Contacto del proveedor
                </h3>
                <p className="bg-gray-50 p-3 rounded-md flex items-center gap-4 text-xs md:text-base">
                  <span className="inline-block">
                    <BiSolidContact size={20} />
                  </span>
                  {report.serviceContactInfo || 'No disponible'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-gray-700 font-bold text-sm mb-2">
                Descripción
              </h3>
              <p className="bg-gray-50 min-h-16 p-3 rounded-lg text-sm md:text-base">
                {report.description || 'No disponible'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-gray-700 font-bold text-sm b">Costo total</h3>
              <p className="bg-gray-50 p-3 rounded-md flex items-center gap-4 text-sm md:text-base">
                <span className="inline-block">
                  <RiMoneyDollarCircleFill size={20} />
                </span>
                {report.totalCost !== undefined && report.totalCost !== null
                  ? parseToCurrency(report.totalCost, 'MXN')
                  : 'No disponible'}
              </p>
            </div>
            {/* Partes reparadas o reemplazadas */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-gray-700 font-bold text-sm mb-2">
                Partes reemplazadas o reparadas
              </h3>
              {report.replacedParts && report.replacedParts.length > 0 ? (
                <ul className="space-y-2">
                  {report.replacedParts.map((part, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-start bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm md:text-base">
                          {part.partName || 'Sin nombre'}
                        </p>
                        <span
                          className={`text-xs text-white py-1 px-2 w-fit rounded-full ${part.actionType === 'REPLACED' ? 'bg-mycad-secondary' : 'bg-mycad-warning'}`}
                        >
                          {part.actionType === 'REPLACED' ? (
                            <span>Reemplazada</span>
                          ) : (
                            <span>Reparada</span>
                          )}
                        </span>
                      </div>
                      <span className="text-sm md:text-base">
                        {part.cost !== undefined && part.cost !== null
                          ? parseToCurrency(part?.cost)
                          : 'N/A'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay partes registradas.</p>
              )}
            </div>

            {/* Comentarios adicionales */}
            <div>
              <h3 className="text-gray-700 font-bold text-sm mb-2">
                Comentarios adicionales
              </h3>
              <p className="bg-gray-50 min-h-16 p-3 rounded-lg text-sm md:text-base">
                {report.comments || 'No hay comentarios adicionales.'}
              </p>
            </div>

            {/* Archivos adjuntos */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-gray-700 font-bold text-sm mb-2">
                Archivos adjuntos al reporte
              </h3>
              {report.attachments && report.attachments.length > 0 ? (
                report.attachments.map((file, index) => (
                  <FileIcon key={index} file={file} />
                ))
              ) : (
                <p>No hay archivos adjuntos.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Cargando información del reporte...</p>
        )}
      </div>
    </section>
  );
};

const ProtectedViewServiceReportView = withPermission(
  ViewServicesReport,
  'view_services_reports',
);

export default ProtectedViewServiceReportView;
