import * as Yup from 'yup';

export const ServicesFormSchema = Yup.object().shape({
  vehicleId: Yup.string().required('El vehículo es obligatorio'),
  reportType: Yup.string().required('El tipo de reporte es obligatorio'),
  serviceDate: Yup.date().required('La fecha del servicio es obligatoria'),
  description: Yup.string().required('La descripción es obligatoria'),
  totalCost: Yup.number()
    .required('El costo total es obligatorio')
    .min(0, 'El costo no puede ser negativo'),
  comments: Yup.string().nullable(),
  replacedParts: Yup.array()
    .of(
      Yup.object().shape({
        partName: Yup.string().required('El nombre de la parte es obligatorio'),
        actionType: Yup.string().required('La acción es obligatoria'),
        cost: Yup.number().min(0, 'El costo no puede ser negativo'),
      }),
    )
    .nullable(),
});
