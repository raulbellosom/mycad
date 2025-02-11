import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';

const ClientsFormFields = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Nombre del Cliente */}
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre"
        placeholder="Nombre del cliente"
        className="w-full"
      />

      {/* Compañía */}
      <Field
        name="company"
        id="company"
        component={TextInput}
        label="Compañía"
        placeholder="Nombre de la compañía"
        className="w-full"
      />

      {/* Correo Electrónico */}
      <Field
        name="email"
        id="email"
        component={TextInput}
        label="Correo electrónico"
        placeholder="Correo electrónico del cliente"
        type="email"
        className="w-full"
      />

      {/* Número de Teléfono */}
      <Field
        name="phoneNumber"
        id="phoneNumber"
        component={TextInput}
        label="Número de teléfono"
        placeholder="Teléfono del cliente"
        className="w-full"
      />
    </div>
  );
};

export default ClientsFormFields;
