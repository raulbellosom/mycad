import * as Yup from 'yup';

export const RentalFormSchema = Yup.object().shape({
  vehicleId: Yup.string().required('El vehículo es requerido'),
  clientId: Yup.string().required('El cliente es requerido'),
  startDate: Yup.date()
    .typeError('La fecha de inicio debe ser una fecha válida')
    .required('La fecha de inicio es requerida'),
  endDate: Yup.date()
    .min(
      Yup.ref('startDate'),
      'La fecha de finalización debe ser después de la fecha de inicio',
    )
    .typeError('La fecha de finalización debe ser una fecha válida')
    .required('La fecha de finalización es requerida'),
  pickupDate: Yup.date()
    .nullable()
    .typeError('La fecha de recogida debe ser una fecha válida'),
  returnDate: Yup.date()
    .nullable()
    .min(
      Yup.ref('pickupDate'),
      'La fecha de devolución debe ser después de la fecha de recogida',
    )
    .typeError('La fecha de devolución debe ser una fecha válida'),
  pickupLocation: Yup.string().nullable(),
  dropoffLocation: Yup.string().nullable(),
  dailyRate: Yup.number()
    .positive('La tarifa diaria debe ser un número positivo')
    .required('La tarifa diaria es requerida'),
  deposit: Yup.number().min(0, 'El depósito no puede ser negativo').nullable(),
  totalCost: Yup.number()
    .min(0, 'El costo total no puede ser negativo')
    .nullable(),
  paymentStatus: Yup.string()
    .oneOf(
      ['PENDING', 'COMPLETED', 'PARTIAL', 'REFUNDED'],
      'Estado de pago inválido',
    )
    .required('El estado de pago es requerido'),
  initialMileage: Yup.number()
    .min(0, 'El kilometraje inicial no puede ser negativo')
    .integer('Debe ser un número entero')
    .required('El kilometraje inicial es requerido'),
  finalMileage: Yup.number()
    .min(0, 'El kilometraje final no puede ser negativo')
    .integer('Debe ser un número entero')
    .nullable(),
  fuelLevelStart: Yup.number()
    .min(0, 'El nivel de combustible inicial no puede ser negativo')
    .max(100, 'El nivel de combustible inicial no puede ser mayor a 100')
    .nullable(),
  fuelLevelEnd: Yup.number()
    .min(0, 'El nivel de combustible final no puede ser negativo')
    .max(100, 'El nivel de combustible final no puede ser mayor a 100')
    .nullable(),
  comments: Yup.string().nullable(),
  status: Yup.string()
    .oneOf(
      ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELED'],
      'Estado de renta inválido',
    )
    .required('El estado de la renta es requerido'),
  files: Yup.array().of(Yup.mixed()),
});
