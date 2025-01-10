import React from 'react';
import ActionButtons from '../ActionButtons/ActionButtons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Botón Anterior */}

      <ActionButtons
        extraActions={[
          {
            action: () => handlePageChange(currentPage - 1),
            color: 'neutral',
            icon: FaChevronLeft,
          },
        ]}
      />

      {/* Indicador de Páginas */}
      <div className="text-sm text-gray-600 dark:text-gray-300 px-2">
        Página {currentPage} de {totalPages}
      </div>

      {/* Botón Siguiente */}

      <ActionButtons
        extraActions={[
          {
            action: () => handlePageChange(currentPage + 1),
            color: 'neutral',
            icon: FaChevronRight,
          },
        ]}
      />
    </div>
  );
};

export default Pagination;
