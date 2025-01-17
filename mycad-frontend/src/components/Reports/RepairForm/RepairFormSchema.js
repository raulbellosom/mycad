import * as Yup from 'yup';

export const RepairFormSchema = Yup.object({
  vehicleId: Yup.string().required('El vehículo es obligatorio'),
  repairDate: Yup.date().required('La fecha de reparación es obligatoria'),
  description: Yup.string().required('La descripción es obligatoria'),
  totalCost: Yup.number()
    .required('El costo total es obligatorio')
    .min(0, 'El costo no puede ser negativo'),
  comments: Yup.string().nullable(),
  workshopType: Yup.string()
    .required('El tipo de taller es obligatorio')
    .oneOf(['INTERNAL', 'EXTERNAL'], 'El tipo de taller no es válido'),
  workshopName: Yup.string()
    .nullable()
    .when('workshopType', {
      is: 'EXTERNAL',
      then: Yup.string().required('El nombre del taller es obligatorio'),
    }),
  workshopContact: Yup.string()
    .nullable()
    .when('workshopType', {
      is: 'EXTERNAL',
      then: Yup.string().required(
        'El contacto del taller es obligatorio para talleres externos',
      ),
      otherwise: Yup.string().nullable(),
    }),
  repairedParts: Yup.array()
    .of(
      Yup.object({
        partName: Yup.string().required('El nombre de la parte es obligatorio'),
        actionType: Yup.string().required('La acción es obligatoria'),
        cost: Yup.number()
          .required('El costo es obligatorio')
          .min(0, 'El costo no puede ser negativo'),
      }),
    )
    .nullable(),
});
