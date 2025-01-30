import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { RepairFormSchema } from './RepairFormSchema';
import RepairFormFields from './RepairFormFields';

const RepairForm = forwardRef(({ initialValues, onSubmit, vehicles }, ref) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RepairFormSchema,
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
        <h2 className="md:text-xl font-bold">Reporte de Reparación</h2>
        <p className="text-sm text-gray-500 mb-6">
          Registra los detalles de la reparación realizada a un vehículo.
        </p>
        <div className="border border-gray-200 rounded-lg p-3 md:p-6 w-full">
          <RepairFormFields vehicles={vehicles} />
        </div>
      </Form>
    </FormikProvider>
  );
});

export default RepairForm;
