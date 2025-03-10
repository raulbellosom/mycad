import * as Yup from 'yup';

export const UserFormSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  userName: Yup.string().required('El nombre de usuario es requerido'),
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es requerido'),
  password: Yup.string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/,
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    ),
  repeatPassword: Yup.string()
    .required('La confirmación de la nueva contraseña es requerida')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
  phone: Yup.string().matches(
    /^\d{10}$/,
    'El número de teléfono debe tener 10 dígitos',
  ),
  photo: Yup.array().of(Yup.mixed()),
  role: Yup.string().required('El rol es requerido'),
  status: Yup.boolean(),
  id: Yup.string(),
});

export const UserFormInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  repeatPassword: '',
  role: '',
  status: true,
  photo: [],
  id: '',
};

export const UserFormUpdateSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es requerido'),
  phone: Yup.string().matches(
    /^\d{10}$/,
    'El número de teléfono debe tener 10 dígitos',
  ),
  role: Yup.string().required('El rol es requerido'),
  status: Yup.boolean(),
  id: Yup.string(),
});

export const UserFormChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/,
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    ),
  repeatPassword: Yup.string()
    .required('La confirmación de la nueva contraseña es requerida')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
  id: Yup.string(),
});
