import React, { useEffect, useState } from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaTrashAlt, FaEye, FaRegFile, FaPen } from 'react-icons/fa';
import TableHeader from '../../../components/Table/TableHeader';
import { useVehicleContext } from '../../../context/VehicleContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination/Pagination';
import { useReports } from '../../../hooks/useReports';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { Dropdown } from 'flowbite-react';
import { PiCarProfileLight } from 'react-icons/pi';

const ServicesReport = () => {
  const navigate = useNavigate();
  const { state, dispatch, fetchFilteredReports } = useReports();
  const { reports, filters, pagination, totalReports } = state;
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch({
        type: 'SET_FILTERS',
        payload: { ...filters, search },
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    if (fetchFilteredReports?.refetch) {
      fetchFilteredReports.refetch();
    }
  }, [filters, pagination]);

  const handleSearch = (e) => {
    const newSearchValue = e.target.value;
    setSearch(newSearchValue);

    // Evita que el `dispatch` se ejecute en cada cambio de tecla (opcional: debounce)
    dispatch({
      type: 'SET_FILTERS',
      payload: { ...filters, search: newSearchValue },
    });
  };

  const handleTypeFilter = (type) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { type },
    });
  };

  const handlePageChange = (page) => {
    dispatch({
      type: 'SET_PAGINATION',
      payload: { page },
    });
  };

  return (
    <section className="flex flex-col gap-4 bg-white shadow-md rounded-md dark:bg-neutral-900 p-4 antialiased">
      {/* Header */}
      <TableHeader
        icon={MdMiscellaneousServices}
        title="Reportes de Mantenimiento y Servicio"
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

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
        <input
          type="search"
          placeholder="Buscar por vehículo"
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/2 rounded-md px-4 py-2"
        />
        <Dropdown color={'light'} label="Tipo de reporte">
          <Dropdown.Item onClick={() => handleTypeFilter('ALL')}>
            Todos
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleTypeFilter('PREVENTIVE')}>
            Mantenimiento
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleTypeFilter('CORRECTIVE')}>
            Servicio
          </Dropdown.Item>
        </Dropdown>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse ">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2 text-left">FOLIO</th>
              <th className="px-4 py-2 text-left">Vehículo</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-right">Costo</th>
              <th className="px-4 py-2 text-center">Archivos</th>
              <th className="px-4 py-2 text-center">Creación</th>
              <th className="px-4 py-2 text-center">Actualización</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-neutral-50 even:bg-neutral-100"
                  onDoubleClick={() =>
                    navigate(`/reports/services/show/${report.id}`)
                  }
                >
                  <td className="px-4 py-2 text-nowrap">{report.folio}</td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2 text-nowrap">
                      <PiCarProfileLight
                        size={'1.5rem'}
                        className="text-neutral-500 mr-2"
                      />
                      {report.vehicle.model.name} ( {report.vehicle.model.year}{' '}
                      ) - {report.vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        report.reportType === 'PREVENTIVE'
                          ? 'bg-mycad-warning'
                          : 'bg-mycad-success'
                      }`}
                    >
                      {report.reportType === 'PREVENTIVE'
                        ? 'Mantenimiento'
                        : 'Servicio'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(report.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 min-w-72">
                    {report?.description && report.description.length > 75
                      ? report.description?.substring(0, 75) + '...'
                      : report.description}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${report.totalCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {report.attachments.length > 0 ? (
                      <span className="w-fit p-2 px-4 flex justify-center items-center gap-2 bg-sky-50 rounded-md">
                        <FaRegFile className="text-neutral-500" />
                        {report.attachments.length}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <ActionButtons
                        extraActions={[
                          {
                            href: `/reports/services/view/${report.id}`,
                            color: 'blue',
                            icon: FaEye,
                          },
                          {
                            href: `/reports/services/edit/${report.id}`,
                            color: 'yellow',
                            icon: FaPen,
                          },
                          {
                            action: () => console.log(`Eliminar ${report.id}`),
                            color: 'red',
                            icon: FaTrashAlt,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No se encontraron reportes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Mostrando {reports.length} de {totalReports} reportes
        </span>
        <Pagination
          currentPage={pagination.page}
          totalItems={totalReports}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default ServicesReport;
