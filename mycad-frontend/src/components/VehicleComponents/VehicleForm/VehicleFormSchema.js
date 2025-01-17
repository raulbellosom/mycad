import * as Yup from 'yup';

export const VehicleFormSchema = Yup.object().shape({
  modelId: Yup.number().required('El modelo es requerido'),
  economicNumber: Yup.string(),
  serialNumber: Yup.string(),
  plateNumber: Yup.string(),
  images: Yup.array().of(Yup.mixed()),
  acquisitionDate: Yup.date()
    .min('1980-01-01', 'La fecha de adquisición no puede ser menor a 1980')
    .max(
      new Date(),
      'La fecha de adquisición no puede ser mayor a la fecha actual',
    )
    .typeError('La fecha de adquisición debe ser una fecha')
    .required('La fecha de adquisición es requerida'),
  cost: Yup.number().positive('El costo debe ser positivo'),
  costCurrency: Yup.string(),
  bookValue: Yup.number(),
  bookValueCurrency: Yup.string(),
  currentMarketValue: Yup.number(),
  marketValueCurrency: Yup.string(),
  mileage: Yup.number()
    .min(0)
    .integer()
    .typeError('El kilometraje debe ser un número')
    .required('El kilometraje es requerido'),
  status: Yup.boolean().required('El estado es requerido'),
  comments: Yup.string().nullable(),
  conditions: Yup.array()
    .of(Yup.number())
    .required('Al menos una condición es requerida'),
});
