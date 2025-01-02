import React, { forwardRef, useImperativeHandle } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { ServicesFormSchema } from './ServicesFormSchema';
import { Button } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';
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
        <Form ref={ref} className="space-y-4" onSubmit={formik.handleSubmit}>
          <ServicesFormFields vehicles={vehicles} />
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
                {isUpdate ? 'Actualizar ' : ' Crear '} reporte
              </>
            </Button>
          </div>
        </Form>
      </FormikProvider>
    );
  },
);

export default ServicesForm;
