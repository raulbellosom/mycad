import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { VehicleFormSchema } from './VehicleFormSchema';
import VehicleFormFields from './VehicleFormFields';

const VehicleForm = forwardRef(
  (
    {
      initialValues,
      onSubmit,
      vehicleModels,
      onOtherModelSelected,
      vehicleConditions,
      isUpdate = false,
    },
    ref,
  ) => {
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: VehicleFormSchema,
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
        <Form ref={ref} className="space-y-4" onSubmit={formik.handleSubmit}>
          <VehicleFormFields
            vehicleModels={vehicleModels}
            vehicleConditions={vehicleConditions}
            onOtherSelected={onOtherModelSelected}
          />
        </Form>
      </FormikProvider>
    );
  },
);

export default VehicleForm;
