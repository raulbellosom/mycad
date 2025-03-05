import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRentalById } from '../../services/rentals.api';
import { useQuery } from '@tanstack/react-query';
import { FaFilePdf, FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import { MdCalendarToday } from 'react-icons/md';
import { Badge } from 'flowbite-react';
import { parseToCurrency, parseToLocalDate } from '../../utils/formatValues';
import { LiaCarSideSolid } from 'react-icons/lia';
import { FiUser } from 'react-icons/fi';
import FileIcon from '../../components/FileIcon/FileIcon';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { IoMdArrowRoundBack } from 'react-icons/io';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  getPaymentStatusIcon,
  getPaymentStatusLabel,
  getPaymentStatusStyles,
  getStatusIcon,
  getStatusLabel,
  getStatusStyles,
} from '../../utils/RentalStatus';
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const ViewRental = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState(null);

  const { data: rental, isFetching } = useQuery({
    queryKey: ['rental', id],
    queryFn: ({ signal }) => getRentalById({ id, signal }),
  });

  useEffect(() => {
    if (rental) {
      const parseAttachments = rental?.files?.map((attachment) => ({
        id: attachment.id,
        url: attachment.url,
        type: attachment.type,
        name:
          JSON?.parse(attachment?.metadata)?.originalName ||
          'Archivo desconocido',
      }));
      setRentalData({
        folio: rental.folio,
        status: rental.status,
        createdAt: rental.createdAt,
        updatedAt: rental.updatedAt,
        vehicle: `${rental.vehicle?.model?.brand?.name || ''} ${rental.vehicle?.model?.type?.name || ''} ${rental.vehicle?.model?.name || ''} ${rental.vehicle?.year || ''}`,
        plate: rental.vehicle?.plateNumber || '',
        client: rental.client?.name || '',
        phone: rental.client?.phoneNumber || '',
        company: rental.client?.company || '',
        period: `${
          rental?.startDate
            ? new Date(rental?.startDate).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : '-'
        } - ${
          rental?.endDate
            ? new Date(rental?.endDate).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'Sin fecha de término'
        }`,
        locations: {
          pickup: rental.pickupLocation,
          return: rental.dropoffLocation,
        },
        financial: {
          dailyRate: rental.dailyRate,
          deposit: rental.deposit,
          total: rental.totalCost,
          status: rental.paymentStatus,
        },
        vehicleStatus: {
          initialMileage: rental.initialMileage,
          finalMileage: rental.finalMileage,
          initialFuel: rental.fuelLevelStart,
          finalFuel: rental.fuelLevelEnd,
        },
        comments: rental.comments || 'Sin comentarios',
        files: parseAttachments || [],
      });
    }
  }, [rental]);

  const exportToPDF = () => {
    const element = document.getElementById('rental-view-container');

    // Asegurar que la vista adopte el diseño de escritorio
    element.style.width = '1024px';

    html2canvas(element, {
      scale: 1.5, // Mejora la calidad de la imagen
      windowWidth: 1024, // Fuerza el ancho del viewport
      scrollY: -window.scrollY, // Evita cortes por scroll
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 0.8);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // Ancho de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantiene la proporción

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`renta_${rentalData?.folio}.pdf`);

      // Restaurar el tamaño original después de la captura
      element.style.width = '';
    });
  };

  const isViewRentalPermission = useCheckPermissions('view_rental');
  const isUpdateRentalPermission = useCheckPermissions('update_rentals');

  return (
    <div
      id="rental-view-container"
      className="max-w-5xl mx-auto bg-white p-2 md:p-8 rounded-lg shadow-md border border-neutral-200"
    >
      <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-4 pb-6 border-b">
        <div className="flex items-center gap-3">
          <LiaCarSideSolid
            size={40}
            className="text-neutral-800 bg-neutral-100 p-2 rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
              <h1 className="text-base md:text-xl font-bold flex items-center gap-3">
                Renta #{rental?.folio}
              </h1>
              <span
                className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${getStatusStyles(rental?.status)}`}
              >
                {getStatusIcon(rental?.status)}
                {getStatusLabel(rental?.status)}
              </span>
            </div>
            <p className="text-neutral-500 text-sm">
              Creada el{' '}
              {new Date(rental?.createdAt).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <ActionButtons
            extraActions={[
              {
                label: '',
                href: isViewRentalPermission.hasPermission ? '/rentals' : '/',
                color: 'black',
                icon: IoMdArrowRoundBack,
              },
              {
                label: '',
                action: exportToPDF,
                icon: FaFilePdf,
                color: 'danger',
              },
              {
                label: '',
                href: isUpdateRentalPermission.hasPermission
                  ? `/rentals/edit/${id}`
                  : '/',
                icon: FaPen,
                color: 'mycad',
                filled: true,
              },
            ]}
          />
        </div>
      </div>
      {isFetching ? (
        <p className="text-center text-neutral-500 py-6">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 border rounded-t-lg p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Detalles Principales</h2>
              <div className="flex items-center gap-4">
                <LiaCarSideSolid className="inline text-neutral-400" />
                <div>
                  <p className="text-neutral-800 text-sm font-bold">Vehículo</p>
                  <p>{rentalData?.vehicle}</p>
                  <p className="text-neutral-500 text-sm">
                    Placa: {rentalData?.plate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiUser className="inline text-neutral-400" />
                <div>
                  <p className="text-neutral-800 text-sm font-bold">Cliente</p>
                  <p>{rentalData?.client}</p>
                  <p className="text-neutral-500 text-sm">
                    Empresa: {rentalData?.company}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Fechas y Ubicaciones</h2>
              <div className="flex items-center gap-4">
                <MdCalendarToday className="inline text-neutral-400" />
                <div>
                  <p className="text-neutral-800 text-sm font-bold">Periodo</p>
                  <p>{rentalData?.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="inline text-neutral-400" />
                <div>
                  <p className="text-neutral-800 text-sm font-bold">
                    Ubicaciones
                  </p>
                  <p>Entrega: {rentalData?.locations.pickup}</p>
                  <p>Recepción: {rentalData?.locations.return}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 border-r border-l p-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-base font-semibold ">
                  Información Financiera
                </h2>
                <span
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${getPaymentStatusStyles(rental.paymentStatus)}`}
                >
                  {getPaymentStatusIcon(rental.paymentStatus)}
                  {getPaymentStatusLabel(rental.paymentStatus)}
                </span>
              </div>
              <div className="grid grid-cols-2 justify-between gap-2 bg-neutral-50 p-4 rounded-t-md text-sm">
                <p>Tarifa diaria</p>
                <p className="text-right font-semibold">
                  {parseToCurrency(rentalData?.financial.dailyRate)}
                </p>
                <p>Depósito</p>
                <p className="text-right font-semibold">
                  {parseToCurrency(rentalData?.financial.deposit)}
                </p>
              </div>
              <div className="grid grid-cols-2 justify-between gap-2 bg-neutral-50 p-4 rounded-b-md border-t border-neutral-200">
                <p className="font-semibold">Total</p>
                <p className="text-right font-semibold">
                  {parseToCurrency(rentalData?.financial.total)}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold pb-4">
                Estado del Vehículo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-t-md">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Kilometraje</p>
                  <div className="flex justify-between text-sm">
                    <p>Inicial</p>
                    <p className="text-right font-semibold">
                      {rentalData?.vehicleStatus.initialMileage} km
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Final</p>
                    <p className="text-right font-semibold">
                      {rentalData?.vehicleStatus.initialMileage} km
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Nivel de Combustible</p>
                  <div className="flex justify-between text-sm">
                    <p>Inicial</p>
                    <p className="text-right font-semibold">
                      {rentalData?.vehicleStatus.initialFuel}%
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Final</p>
                    <p className="text-right font-semibold">
                      {rentalData?.vehicleStatus.finalFuel}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 border-r border-l p-4">
            <div>
              <h2 className="text-base font-semibold pb-4">
                Estado del Vehículo
              </h2>
              <p className="bg-neutral-100 p-3 rounded-md text-neutral-600">
                {rentalData?.comments}
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold pb-4">
                Estado del Vehículo
              </h2>
              <div className="p-4 bg-neutral-50 rounded-md">
                {rentalData?.files.length > 0 ? (
                  rentalData.files.map((file, index) => (
                    <FileIcon key={index} file={file} />
                  ))
                ) : (
                  <p className="text-neutral-500">No hay archivos adjuntos</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 flex justify-end bg-neutral-200 p-4 rounded-b-lg border">
            {/* updated at */}
            <p className="text-neutral-500 text-sm">
              Última actualización:{' '}
              {new Date(rentalData?.updatedAt).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProtectedRentalsView = withPermission(ViewRental, 'view_rentals');

export default ProtectedRentalsView;
