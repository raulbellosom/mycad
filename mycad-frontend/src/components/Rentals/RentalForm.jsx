import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { RentalFormSchema } from './RentalFormSchema';
import RentalFormFields from './RentalFormFields';

const RentalForm = forwardRef(
  ({ initialValues, onSubmit, vehicles, clients, isUpdate = false }, ref) => {
    const formik = useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema: RentalFormSchema,
      onSubmit: (values, actions) => {
        onSubmit(values, actions);
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formik.submitForm();
      },
    }));
    console.log(vehicles);
    return (
      <FormikProvider value={formik}>
        <Form ref={ref} className="space-y-4" onSubmit={formik.handleSubmit}>
          <RentalFormFields vehicles={vehicles} clients={clients} />
        </Form>
      </FormikProvider>
    );
  },
);

export default RentalForm;
