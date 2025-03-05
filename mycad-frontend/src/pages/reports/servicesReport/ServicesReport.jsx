import React, { useEffect, useState } from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaTrashAlt, FaEye, FaRegFile, FaPen } from 'react-icons/fa';
import TableHeader from '../../../components/Table/TableHeader';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination/Pagination';
import { useReports } from '../../../hooks/useReports';
import ActionButtons from '../../../components/ActionButtons/ActionButtons';
import { Dropdown } from 'flowbite-react';
import { PiCarProfileLight } from 'react-icons/pi';
import ModalRemove from '../../../components/Modals/ModalRemove';
import classNames from 'classnames';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import withPermission from '../../../utils/withPermissions';

const ServicesReport = () => {
  const navigate = useNavigate();
  const { state, dispatch, fetchFilteredReports, removeReport } = useReports();
  const { reports, filters, pagination, totalReports } = state;
  const [search, setSearch] = useState(filters.search || '');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [idReport, setIdReport] = useState(null);

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedReports = React.useMemo(() => {
    if (!sortConfig.key) return reports;
    return [...reports].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [reports, sortConfig]);

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

  const handleDeleteVehicle = () => {
    removeReport.mutateAsync(idReport);
    setIsOpenModal(false);
  };

  const handleOpenModal = (id) => {
    setIsOpenModal(true);
    setIdReport(id);
  };

  return (
    <>
      <section className="flex flex-col gap-4 bg-white shadow-md rounded-md dark:bg-neutral-900 p-4 antialiased">
        {/* Header */}
        <TableHeader
          icon={MdMiscellaneousServices}
          title="Reportes de Servicio y Mantenimiento"
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
            placeholder="Buscar por vehículo, costo, descripción..."
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
              <tr className="whitespace-nowrap text-nowrap">
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer first:rounded-tl-md',
                    sortConfig.key === 'folio'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('folio')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'folio' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>FOLIO</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'vehicle'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('vehicle')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'vehicle' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Vehículo</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'reportType'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('reportType')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'reportType' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Tipo</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'serviceDate'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('serviceDate')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'serviceDate' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Fecha</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'description'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'description' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Descripción</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'serviceProviderName'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('serviceProviderName')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'serviceProviderName' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Proovedor del servicio</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'totalCost'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('totalCost')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'totalCost' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Costo</p>
                  </div>
                </th>
                <th className="px-4 py-2 text-center">Archivos</th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'createdAt'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'createdAt' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Creación</p>
                  </div>
                </th>
                <th
                  className={classNames(
                    'px-4 py-2 text-left cursor-pointer',
                    sortConfig.key === 'updatedAt'
                      ? 'bg-mycad-primary text-white transition-all ease-in-out duration-200'
                      : '',
                  )}
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-2">
                    {sortConfig.key === 'updatedAt' &&
                      (sortConfig.direction === 'asc' ? (
                        <HiSortAscending size={'1.3rem'} />
                      ) : (
                        <HiSortDescending size={'1.3rem'} />
                      ))}
                    <p>Actualización</p>
                  </div>
                </th>
                <th className="px-4 py-2 text-center last:rounded-tr-md">
                  <p>Acciones</p>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedReports.length > 0 ? (
                sortedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-neutral-50 even:bg-neutral-100 text-nowrap"
                    onDoubleClick={() =>
                      navigate(`/reports/services/view/${report.id}`)
                    }
                  >
                    <td className="px-4 py-2 w-fit">{report.folio}</td>
                    <td className="px-4 py-2">
                      <span className="flex items-center gap-2">
                        <PiCarProfileLight
                          size={'1.5rem'}
                          className="text-neutral-500 mr-2"
                        />
                        {report.vehicle.model.name} ({' '}
                        {report.vehicle.model.year} ) -{' '}
                        {report.vehicle.plateNumber}
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
                      {new Date(report.serviceDate).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-2 min-w-72 text-wrap">
                      {report?.description && report.description.length > 75
                        ? report.description?.substring(0, 75) + '...'
                        : report.description}
                    </td>
                    <td className="px-4 py-2">{report.serviceProviderName}</td>
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
                      {new Date(report.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(report.updatedAt).toLocaleDateString('es-MX')}
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
                              action: () => handleOpenModal(report.id),
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
        <div className="flex flex-col md:flex-row items-center justify-between pt-4">
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
      <ModalRemove
        isOpenModal={isOpenModal}
        onCloseModal={() => setIsOpenModal(false)}
        removeFunction={handleDeleteVehicle}
      />
    </>
  );
};

const ProtectedServiceReportView = withPermission(
  ServicesReport,
  'view_services_reports',
);

export default ProtectedServiceReportView;
