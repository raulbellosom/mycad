import classNames from 'classnames';
import React from 'react';
import { Select, Tooltip } from 'flowbite-react';

const TableFooter = ({
  pagination,
  goOnPrevPage,
  goOnNextPage,
  handleSelectChange,
  changePageSize,
}) => {
  const { totalRecords, totalPages, currentPage, pageSize } = pagination;
  const index = pageSize * currentPage - pageSize + 1;
  const paginationNumber = [];

  const activePagClass =
    'flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-orange-600 bg-orange-50 border border-orange-300 hover:bg-orange-100 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white';
  const pagClass =
    'flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';
  const disablePagClass =
    'pointer-events-none opacity-60 flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    paginationNumber.push(
      <li key={i} onClick={() => handleSelectChange(i)}>
        <a
          href="#"
          className={classNames(i === currentPage ? activePagClass : pagClass)}
        >
          {i}
        </a>
      </li>,
    );
  }

  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Mostrando&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalRecords === index
              ? totalRecords
              : `${index} - ${pageSize + index - 1 >= totalRecords ? totalRecords : pageSize + index - 1}`}
          </span>
          &nbsp;de&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalRecords}
          </span>
          &nbsp;resultados
        </span>
        <Tooltip
          content={
            totalRecords == 0 ? 'No hay resultados' : 'Resultados por pagina'
          }
        >
          <Select
            className="font-semibold"
            style={{
              backgroundColor: 'transparent',
              borderRadius: '0',
              border: 0,
              borderBottom: '1px solid #e5e7eb',
            }}
            value={pageSize}
            onChange={changePageSize}
            disabled={totalRecords === 0}
          >
            {[3, 5, 10, 15, 20, 30, 50, 100].map((item) => (
              <option disabled={totalRecords < item} key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Tooltip>
      </div>
      <ul className="inline-flex items-stretch -space-x-px">
        <li
          key="prev"
          onClick={goOnPrevPage}
          className={index === 1 ? 'pointer-events-none opacity-60' : ''}
        >
          <a
            href="#"
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>
        {paginationNumber?.map((item) => item)}
        <li
          key="next"
          onClick={goOnNextPage}
          className={
            pageSize + index - 1 >= totalRecords
              ? 'pointer-events-none opacity-60'
              : 'cursor-pointer'
          }
        >
          <a className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default React.memo(TableFooter);
