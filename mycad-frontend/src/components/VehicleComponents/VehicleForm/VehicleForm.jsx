import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { VehicleFormSchema } from './VehicleFormSchema';
import VehicleFormFields from './VehicleFormFields';
import { Button } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';

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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="py-2 rounded"
              color={formik.isSubmitting ? 'gray' : 'purple'}
              isProcessing={formik.isSubmitting}
            >
              <>
                <FaSave size={20} className="mr-2" />
                {isUpdate ? 'Actualizar ' : ' Crear '} Vehículo
              </>
            </Button>
          </div>
        </Form>
      </FormikProvider>
    );
  },
);

export default VehicleForm;
