import React, { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRentalContext } from '../../context/RentalContext';
import ModalRemove from '../../components/Modals/ModalRemove';
import ModalViewer from '../../components/Modals/ModalViewer';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaEdit, FaEye, FaRegFile } from 'react-icons/fa';
import { Table as T } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { searchRentals } from '../../services/rentals.api';
import Card from '../../components/Card/Card';
import { parseToCurrency, parseToLocalDate } from '../../utils/formatValues';
import Notifies from '../../components/Notifies/Notifies';
import { IoMdAdd } from 'react-icons/io';
import { rentalColumns } from '../../utils/RentalFields';
import TableResultsNotFound from '../../components/Table/TableResultsNotFound';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
const Table = React.lazy(() => import('../../components/Table/Table'));
const TableHeader = React.lazy(
  () => import('../../components/Table/TableHeader'),
);
const TableActions = React.lazy(
  () => import('../../components/Table/TableActions'),
);
const TableFooter = React.lazy(
  () => import('../../components/Table/TableFooter'),
);
import LinkButton from '../../components/ActionButtons/LinkButton';
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';
import {
  getPaymentStatusIcon,
  getPaymentStatusLabel,
  getPaymentStatusStyles,
  getStatusIcon,
  getStatusLabel,
  getStatusStyles,
} from '../../utils/RentalStatus';

const Rentals = () => {
  const { deleteRental } = useRentalContext();
  const [columns, setColumns] = useState([...rentalColumns]);
  const navigate = useNavigate();
  const lastChange = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rentalId, setRentalId] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    pageSize: 5,
    page: currentPageNumber,
    sortBy: 'createdAt',
    order: 'asc',
    status: [],
    paymentStatus: [],
  });

  const rentalStatus = [
    { id: 1, name: 'Pendiente' },
    { id: 2, name: 'Activa' },
    { id: 3, name: 'Completada' },
    { id: 4, name: 'Cancelada' },
  ];

  const {
    data: rentals,
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ['rentals', { ...searchFilters }],
    queryFn: ({ signal }) => searchRentals({ ...searchFilters, signal }),
    staleTime: Infinity,
  });

  useEffect(() => {
    refetch();
  }, [searchFilters]);

  const goOnPrevPage = () => {
    setSearchFilters((prevState) => ({
      ...prevState,
      page: prevState.page - 1,
    }));
  };

  const goOnNextPage = () => {
    setSearchFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  };

  const handleSelectChange = useCallback((page) => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page,
      };
    });
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
      lastChange.current = setTimeout(() => {
        setSearchFilters((prevState) => ({
          ...prevState,
          searchTerm: e.target.value,
          page: 1,
        }));
      }, 500);
    },
    [searchFilters.searchTerm],
  );

  const sortBy = (column) => {
    const selectedHeaderIndex = columns?.findIndex((col) => col.id === column);
    let updatedHeaders = [];
    if (selectedHeaderIndex !== -1) {
      const selectedHeader = columns[selectedHeaderIndex];
      selectedHeader;
      const updatedHeader = {
        ...selectedHeader,
        order: selectedHeader?.order === 'asc' ? 'desc' : 'asc',
      };
      updatedHeaders = [...columns];
      updatedHeaders[selectedHeaderIndex] = updatedHeader;
      setSearchFilters((prevState) => {
        return {
          ...prevState,
          sortBy: column,
          order: updatedHeader?.order,
        };
      });
    }
    setColumns(updatedHeaders);
  };

  const onCheckFilter = (value) => {
    if (value !== '') {
      if (value === 'Seleccionar todos') {
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            status: rentalStatus.map((condition) => condition.name),
          };
        });
      } else if (value === 'Quitar todos') {
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            status: [],
          };
        });
      } else {
        let currentValues = [...searchFilters?.status];
        if (currentValues?.includes(value)) {
          currentValues = currentValues.filter(
            (condition) => condition !== value,
          );
        } else {
          currentValues.push(value);
        }
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            status: currentValues,
          };
        });
      }
    }
  };

  const handleChangePageSize = (e) => {
    setSearchFilters((prevState) => ({
      ...prevState,
      pageSize: e.target.value,
      page: 1,
    }));
  };

  const handleDeleteRental = () => {
    if (rentalId) {
      deleteRental(rentalId);
      navigate('/rentals');
      setIsOpenModal(false);
    }
  };

  const handleGetChanges = () => {
    refetch();
    Notifies('success', 'Rentas actualizadas');
  };

  const isCreatePermission = useCheckPermissions('create_rentals');

  return (
    <>
      <section className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
        <TableHeader
          icon={FaFileInvoiceDollar}
          title="Rentas"
          actions={[
            {
              label: 'Nuevo',
              href: isCreatePermission.hasPermission ? '/rentals/create' : null,
              color: 'mycad',
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
        <TableActions
          handleSearchTerm={handleSearch}
          onCheckFilter={onCheckFilter}
          onRefreshData={handleGetChanges}
          headers={columns}
          selectedFilters={searchFilters.status}
          filters={rentalStatus}
        />
        {rentals && !isPending ? (
          rentals?.data?.length > 0 ? (
            <>
              <div>
                <Table
                  columns={columns}
                  sortBy={sortBy}
                  sortedBy={searchFilters.sortBy}
                >
                  {rentals?.data?.map((rental) => (
                    <T.Row
                      key={rental.id}
                      onDoubleClick={() =>
                        navigate(`/rentals/view/${rental.id}`)
                      }
                      className="border-b dark:border-gray-600 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {rentalColumns.map((column) => (
                        <T.Cell key={column.id} className="py-2 text-nowrap">
                          {column.id === 'vehicleInfo' ? (
                            rental.vehicle ? (
                              <div className="flex flex-col p-2  border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {rental.vehicle.model?.name}{' '}
                                  {rental.vehicle.model?.year}
                                  {rental.vehicle.plateNumber &&
                                    ` - ${rental.vehicle.plateNumber}`}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {rental.vehicle.model?.brand?.name} -
                                  {rental.vehicle.model?.type?.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">
                                No disponible
                              </span>
                            )
                          ) : column.id === 'clientInfo' ? (
                            rental.client ? (
                              <div className="flex flex-col p-2  border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {rental.client.name}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {rental.client.company || 'No especificado'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">
                                No disponible
                              </span>
                            )
                          ) : column.id === 'status' ? (
                            <span
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${getStatusStyles(rental.status)}`}
                            >
                              {getStatusIcon(rental.status)}
                              {getStatusLabel(rental.status)}
                            </span>
                          ) : column.id === 'paymentStatus' ? (
                            <span
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${getPaymentStatusStyles(rental.paymentStatus)}`}
                            >
                              {getPaymentStatusIcon(rental.paymentStatus)}
                              {getPaymentStatusLabel(rental.paymentStatus)}
                            </span>
                          ) : column.type === 'image' ? (
                            <ImageViewer
                              images={rental.vehicle?.images}
                              alt={rental.client?.name}
                              containerClassNames={column.classes}
                              isDownloadable={true}
                            />
                          ) : column.type === 'currency' ? (
                            parseToCurrency(rental[column.id])
                          ) : column.type === 'date' ? (
                            parseToLocalDate(rental[column.id])
                          ) : column.type === 'files' ? (
                            <span className="w-fit p-2 px-4 flex justify-center items-center gap-2 bg-sky-50 rounded-md">
                              <FaRegFile className="text-neutral-500" />
                              {rental[column.id]?.length}
                            </span>
                          ) : column.type === 'actions' ? (
                            <div className="flex justify-center items-center gap-2">
                              <LinkButton
                                route={`/rentals/edit/${rental.id}`}
                                label="Editar"
                                icon={FaEdit}
                                color="yellow"
                              />
                              <LinkButton
                                route={`/rentals/view/${rental.id}`}
                                label="Ver"
                                icon={FaEye}
                                color="cyan"
                              />
                              <ActionButtons
                                onRemove={() => {
                                  setIsOpenModal(true);
                                  setRentalId(rental.id);
                                }}
                              />
                            </div>
                          ) : (
                            rental[column.id]
                          )}
                        </T.Cell>
                      ))}
                    </T.Row>
                  ))}
                </Table>
              </div>
            </>
          ) : (
            <TableResultsNotFound />
          )
        ) : (
          <Skeleton className="w-full h-10" count={10} />
        )}
        {rentals?.pagination && (
          <TableFooter
            pagination={rentals?.pagination}
            goOnNextPage={goOnNextPage}
            goOnPrevPage={goOnPrevPage}
            handleSelectChange={handleSelectChange}
            changePageSize={handleChangePageSize}
          />
        )}
      </section>
      {isOpenModal && (
        <ModalRemove
          isOpenModal={isOpenModal}
          onCloseModal={() => setIsOpenModal(false)}
          removeFunction={handleDeleteRental}
        />
      )}
    </>
  );
};

const ProtectedRentalsView = withPermission(Rentals, 'view_rentals');

export default ProtectedRentalsView;
