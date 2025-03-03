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
        vehicle: `${rental.vehicle?.brand || ''} ${rental.vehicle?.model || ''} ${rental.vehicle?.year || ''}`,
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

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FaCar className="text-gray-600" /> Renta #{id}
          </h1>
          <p className="text-gray-500 text-sm">
            Creada el {parseToLocalDate(rental?.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            color={rentalData?.financial.status === 'PAID' ? 'green' : 'red'}
          >
            {rentalData?.financial.status === 'PAID' ? 'Pagado' : 'Pendiente'}
          </Badge>
          <button className="flex items-center px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
            <MdPrint className="mr-2" /> Imprimir
          </button>
        </div>
      </div>
      {isFetching ? (
        <p className="text-center text-gray-500 py-6">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-lg font-semibold">Detalles Principales</h2>
            <p>
              <strong>Vehículo:</strong> {rentalData?.vehicle}
            </p>
            <p>
              <strong>Placa:</strong> {rentalData?.plate}
            </p>
            <p>
              <strong>Cliente:</strong> {rentalData?.client} (
              {rentalData?.phone})
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Fechas y Ubicaciones</h2>
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
          <div className="col-span-2 bg-gray-50 p-4 rounded-md">
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
            <p className="bg-gray-100 p-3 rounded-md text-gray-600">
              {rentalData?.comments}
            </p>
          </div>
          <div className="col-span-2">
            <h2 className="text-lg font-semibold">Archivos Adjuntos</h2>
            <div className="bg-gray-50 p-4 rounded-md flex flex-col gap-3">
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
                <p className="text-gray-500">No hay archivos adjuntos</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalView;
