import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import MyCADLogo from '../../assets/logo/mycad_icon.png';
import BgPattern from '../../assets/bg/pattern-randomized.png';
import { FaSignInAlt } from 'react-icons/fa';
import TextInput from '../../components/Inputs/TextInput';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { Button } from 'flowbite-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required(
        'El correo electrónico o nombre de usuario es invalido',
      ),
      password: Yup.string().required('La contraseña es invalida'),
    }),
    onSubmit: async (values) => {
      await login(values);
      navigate('/');
    },
  });

  return (
    <FormikProvider value={formik}>
      <div
        className="h-dvh max-h-dvh overflow-hidden w-full flex items-center justify-center bg-gray-100 bg"
        style={{ backgroundImage: `url(${BgPattern})` }}
      >
        <div className="bg-white/70 p-8 m-4 rounded shadow-lg w-full max-w-md">
          <div className="flex flex-col items-center justify-center">
            <img src={MyCADLogo} alt="MyCAD Logo" className="h-16 mb-4" />
            <h1 className="text-xl 2xl:text-3xl font-bold text-gray-800 mb-4">
              MyCAD
            </h1>
          </div>
          <h2 className="text-2xl mb-6">Iniciar Sesión</h2>
          <Form
            ref={formRef}
            className="space-y-4"
            onSubmit={formik.handleSubmit}
          >
            <Field
              component={TextInput}
              id="email"
              name="email"
              type="text"
              label="Correo Electrónico o Nombre de Usuario"
              icon={MdOutlineAlternateEmail}
            />
            <Field
              component={TextInput}
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              icon={MdOutlinePassword}
            />
            <div className="flex justify-center w-full items-center gap-4 pt-4">
              <Button
                className="w-full"
                type="submit"
                gradientDuoTone="pinkToOrange"
              >
                <FaSignInAlt className="mr-2" />
                Iniciar Sesión
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </FormikProvider>
  );
};

export default Login;
