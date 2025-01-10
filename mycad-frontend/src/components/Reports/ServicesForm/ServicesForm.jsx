import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { ServicesFormSchema } from './ServicesFormSchema';
import ServicesFormFields from './ServicesFormFields';

const ServicesForm = forwardRef(
  ({ initialValues, onSubmit, vehicles, isUpdate = false }, ref) => {
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: ServicesFormSchema,
      onSubmit: (values, actions) => {
        onSubmit(values, actions);
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formik.submitForm();
      },
    }));

    return (
      <FormikProvider value={formik}>
        <Form ref={ref} className="space-y-6" onSubmit={formik.handleSubmit}>
          <h2 className="text-xl font-bold mb-4">
            Reporte de Mantenimiento o Servicio
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Registra los detalles del mantenimiento o servicio realizado a un
            vehículo.
          </p>
          <ServicesFormFields vehicles={vehicles} />
        </Form>
      </FormikProvider>
    );
  },
);

export default ServicesForm;
