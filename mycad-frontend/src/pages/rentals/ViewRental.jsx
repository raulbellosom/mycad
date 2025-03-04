import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRentalById } from '../../services/rentals.api';
import { API_URL } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import {
  MdCalendarToday,
  MdAttachMoney,
  MdInfo,
  MdFileDownload,
  MdLocalGasStation,
  MdSpeed,
  MdPrint,
} from 'react-icons/md';
import { Badge } from 'flowbite-react';
import { parseToCurrency, parseToLocalDate } from '../../utils/formatValues';
import { LiaCarSideSolid } from 'react-icons/lia';

const RentalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState(null);

  const { data: rental, isFetching } = useQuery({
    queryKey: ['rental', id],
    queryFn: ({ signal }) => getRentalById({ id, signal }),
  });

  useEffect(() => {
    if (rental) {
      setRentalData({
        folio: rental.folio,
        status: rental.status,
        createdAt: rental.createdAt,
        updatedAt: rental.updatedAt,
        vehicle: `${rental.vehicle?.brand?.name || ''} ${rental.vehicle?.model?.name || ''} ${rental.vehicle?.year || ''}`,
        plate: rental.vehicle?.plateNumber || '',
        client: rental.client?.name || '',
        phone: rental.client?.phoneNumber || '',
        period: `${parseToLocalDate(rental.startDate)} - ${parseToLocalDate(rental.endDate)}`,
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
        files: rental.files || [],
      });
    }
  }, [rental]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'ACTIVE':
        return 'blue';
      case 'COMPLETED':
        return 'gray';
      case 'CANCELED':
        return 'red';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PAID':
        return 'Pagado';
      case 'PENDING':
        return 'Pendiente';
      case 'ACTIVE':
        return 'Activo';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELED':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md border border-neutral-200">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <div className="flex items-center gap-3">
            <LiaCarSideSolid
              size={40}
              className="text-neutral-800 bg-neutral-100 p-2 rounded-full"
            />
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold flex items-center gap-3">
                  Renta #{rental?.folio}
                </h1>
                <Badge
                  color={getStatusBadgeColor(rental?.status)}
                  className="text-sm"
                >
                  {getStatusText(rental?.status)}
                </Badge>
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
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center px-3 py-2 border rounded-md text-neutral-600 hover:bg-neutral-100">
            <MdPrint className="mr-2" /> Imprimir
          </button>
        </div>
      </div>
      {isFetching ? (
        <p className="text-center text-neutral-500 py-6">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="grid grid-cols-2 gap-4 col-span-2 border p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Detalles Principales</h2>
              <div>
                <p className="text-neutral-800 text-sm font-bold">Vehículo</p>
                <p>{rentalData?.vehicle}</p>
                <p className="text-neutral-500 text-xs">
                  <strong>Placa:</strong> {rentalData?.plate}
                </p>
              </div>
              <p>
                <strong>Cliente:</strong> {rentalData?.client} (
                {rentalData?.phone})
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold">Fechas y Ubicaciones</h2>
              <p>
                <MdCalendarToday className="inline" /> {rentalData?.period}
              </p>
              <p>
                <FaMapMarkerAlt className="inline" /> Entrega:{' '}
                {rentalData?.locations.pickup}
              </p>
              <p>
                <FaMapMarkerAlt className="inline" /> Devolución:{' '}
                {rentalData?.locations.return}
              </p>
            </div>
          </div>
          <div className="col-span-2 bg-neutral-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold">Información Financiera</h2>
            <p>
              <strong>Tarifa Diaria:</strong>{' '}
              {parseToCurrency(rentalData?.financial.dailyRate)}
            </p>
            <p>
              <strong>Depósito:</strong>{' '}
              {parseToCurrency(rentalData?.financial.deposit)}
            </p>
            <p className="text-xl font-semibold mt-2">
              <strong>Total:</strong>{' '}
              {parseToCurrency(rentalData?.financial.total)}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Estado del Vehículo</h2>
            <p>
              <MdSpeed className="inline" /> <strong>Kilometraje:</strong>{' '}
              {rentalData?.vehicleStatus.initialMileage} km →{' '}
              {rentalData?.vehicleStatus.finalMileage} km
            </p>
            <p>
              <MdLocalGasStation className="inline" />{' '}
              <strong>Combustible:</strong>{' '}
              {rentalData?.vehicleStatus.initialFuel}% →{' '}
              {rentalData?.vehicleStatus.finalFuel}%
            </p>
          </div>
          <div className="col-span-2">
            <h2 className="text-lg font-semibold">Comentarios</h2>
            <p className="bg-neutral-100 p-3 rounded-md text-neutral-600">
              {rentalData?.comments}
            </p>
          </div>
          <div className="col-span-2">
            <h2 className="text-lg font-semibold">Archivos Adjuntos</h2>
            <div className="bg-neutral-50 p-4 rounded-md flex flex-col gap-3">
              {rentalData?.files.length > 0 ? (
                rentalData.files.map((file, index) => (
                  <a
                    key={index}
                    href={`${API_URL}/${file.url}`}
                    download
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <MdFileDownload /> {JSON.parse(file.metadata).originalName}{' '}
                    ({(JSON.parse(file.metadata).size / 1024 / 1024).toFixed(1)}{' '}
                    MB)
                  </a>
                ))
              ) : (
                <p className="text-neutral-500">No hay archivos adjuntos</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalView;
