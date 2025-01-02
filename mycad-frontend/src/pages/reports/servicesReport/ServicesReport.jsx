import React, { useEffect, useState } from 'react';
import { useServiceReportContext } from '../../../context/serviceReportContext';
import TableHeader from '../../../components/Table/TableHeader';
import { MdMiscellaneousServices } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import ServicesForm from '../../../components/Reports/ServicesForm/ServicesForm';
import { useVehicleContext } from '../../../context/VehicleContext';

const ServicesReport = () => {
  const { vehicles } = useVehicleContext();
  const { serviceReports: reports } = useServiceReportContext();
  const [serviceReports, setServiceReports] = useState({});

  useEffect(() => {
    setServiceReports(reports);
  }, [reports]);

  return (
    <>
      <section className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
        <TableHeader
          icon={MdMiscellaneousServices}
          title="Servicios y Mantenimientos"
          actions={[
            {
              label: 'Nuevo',
              href: '/reports/services/create',
              color: 'mycad',
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
      </section>
    </>
  );
};

export default ServicesReport;
