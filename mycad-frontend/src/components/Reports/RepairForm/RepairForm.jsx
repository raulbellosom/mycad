import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { RepairFormSchema } from './RepairFormSchema';
import RepairFormFields from './RepairFormFields';

const RepairForm = forwardRef(
  ({ initialValues, onSubmit, vehicles, isUpdate = false }, ref) => {
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
        <Form ref={ref} onSubmit={formik.handleSubmit}>
          <h2 className="text-xl font-bold">Reporte de Reparación</h2>
          <p className="text-sm text-gray-500 mb-6">
            Registra los detalles de la reparación realizada a un vehículo.
          </p>
          <RepairFormFields
            vehicles={vehicles}
            workshopType={initialValues?.workshopType}
          />
        </Form>
      </FormikProvider>
    );
  },
);

export default RepairForm;
