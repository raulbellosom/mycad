import React from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import BrandFormFields from './BrandFormFields';

import { Button } from 'flowbite-react';
import { FaRegTrashAlt, FaSave } from 'react-icons/fa';
import { BrandFormSchema } from './BrandFormSchema';

const BrandForm = ({ initialValues, onSubmit, isUpdate = false }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: BrandFormSchema,
    onSubmit: (values, actions) => {
      onSubmit(values, actions);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Form className="space-y-4" onSubmit={formik.handleSubmit}>
        <BrandFormFields />
        <div className="flex justify-end items-center space-x-4 pt-4">
          <Button type="button" color="gray" onClick={() => formik.resetForm()}>
            <FaRegTrashAlt size={20} className="mr-2" />
            Limpiar
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
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
};

export default BrandForm;
