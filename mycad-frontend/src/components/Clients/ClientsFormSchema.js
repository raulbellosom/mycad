import * as Yup from 'yup';

export const ClientsFormSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  company: Yup.string().required('La compañía es obligatoria'),
  email: Yup.string().email('Formato de correo no válido'),
  phoneNumber: Yup.string(),
});
