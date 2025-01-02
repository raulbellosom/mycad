import * as Yup from 'yup';

export const ServicesFormSchema = Yup.object().shape({
  vehicleId: Yup.string().required('El vehículo es requerido'),
  serviceType: Yup.string().required('El tipo de servicio es requerido'),
  serviceDate: Yup.date().required('La fecha del servicio es requerida'),
  description: Yup.string(),
  totalCost: Yup.number().positive('El costo total debe ser positivo'),
  comments: Yup.string().nullable(),
  attachments: Yup.array().of(Yup.mixed()),
  replacedParts: Yup.array().of(
    Yup.object().shape({
      partName: Yup.string().required('La parte es requerida'),
      actionType: Yup.string().required('El tipo de acción es requerido'),
      cost: Yup.number().positive('El costo debe ser positivo'),
    }),
  ),
});
