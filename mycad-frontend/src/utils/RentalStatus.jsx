import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUndo,
} from 'react-icons/fa';

// 🔹 Función para obtener el texto en español del estado de la renta
export const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendiente',
    ACTIVE: 'Activa',
    COMPLETED: 'Completada',
    CANCELED: 'Cancelada',
  };
  return labels[status] || 'Desconocido';
};

// 🔹 Función para obtener el icono representativo del estado de la renta
export const getStatusIcon = (status) => {
  const icons = {
    PENDING: <FaHourglassHalf className="text-yellow-600" />,
    ACTIVE: <FaCheckCircle className="text-green-600" />,
    COMPLETED: <FaCheckCircle className="text-blue-600" />,
    CANCELED: <FaTimesCircle className="text-red-600" />,
  };
  return icons[status] || <FaExclamationTriangle className="text-gray-600" />;
};

// 🔹 Función para obtener los estilos del estado de la renta
export const getStatusStyles = (status) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-500 text-xs',
    ACTIVE: 'bg-green-100 text-green-700 border border-green-500 text-xs',
    COMPLETED: 'bg-blue-100 text-blue-700 border border-blue-500 text-xs',
    CANCELED: 'bg-red-100 text-red-700 border border-red-500 text-xs',
  };
  return (
    styles[status] || 'bg-gray-100 text-gray-700 border border-gray-500 text-xs'
  );
};

// 🔹 Función para obtener el texto en español del estado del pago
export const getPaymentStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendiente',
    COMPLETED: 'Pagado',
    PARTIAL: 'Parcialmente Pagado',
    REFUNDED: 'Reembolsado',
  };
  return labels[status] || 'Desconocido';
};

// 🔹 Función para obtener el icono representativo del estado del pago
export const getPaymentStatusIcon = (status) => {
  const icons = {
    PENDING: <FaHourglassHalf className="text-yellow-600" />,
    COMPLETED: <FaCheckCircle className="text-green-600" />,
    PARTIAL: <FaExclamationTriangle className="text-orange-600" />,
    REFUNDED: <FaUndo className="text-blue-600" />,
  };
  return icons[status] || <FaExclamationTriangle className="text-gray-600" />;
};

// 🔹 Función para obtener los estilos del estado del pago
export const getPaymentStatusStyles = (status) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-500 text-xs',
    COMPLETED: 'bg-green-100 text-green-700 border border-green-500 text-xs',
    PARTIAL: 'bg-orange-100 text-orange-700 border border-orange-500 text-xs',
    REFUNDED: 'bg-blue-100 text-blue-700 border border-blue-500 text-xs',
  };
  return (
    styles[status] || 'bg-gray-100 text-gray-700 border border-gray-500 text-xs'
  );
};

export default {
  getStatusLabel,
  getStatusIcon,
  getStatusStyles,
  getPaymentStatusLabel,
  getPaymentStatusIcon,
  getPaymentStatusStyles,
};
