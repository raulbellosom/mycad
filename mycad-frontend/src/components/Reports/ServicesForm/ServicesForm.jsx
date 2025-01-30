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
        <Form
          className="w-full max-w-3xl mx-auto"
          ref={ref}
          onSubmit={formik.handleSubmit}
        >
          <h2 className="text-xl font-bold">
            Reporte de Mantenimiento o Servicio
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Registra los detalles del mantenimiento o servicio realizado a un
            vehículo.
          </p>
          <div className="border border-gray-200 rounded-lg p-3 md:p-6 w-full">
            <ServicesFormFields vehicles={vehicles} />
          </div>
        </Form>
      </FormikProvider>
    );
  },
);

export default ServicesForm;
