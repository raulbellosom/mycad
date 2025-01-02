import React from 'react';
import { Field } from 'formik';
import TextInput from '../../Inputs/TextInput';
import SelectInput from '../../Inputs/SelectInput';
import TextArea from '../../Inputs/TextArea';
import FileInput from '../../Inputs/FileInput';

const ServicesFormFields = ({ vehicles }) => {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-0">
      <div className="col-span-12">
        <Field
          name="vehicleId"
          id="vehicleId"
          component={SelectInput}
          label="Vehículo"
          options={vehicles.map((vehicle) => ({
            label: `${vehicle.plate} - ${vehicle.model.name}`,
            value: vehicle.id,
          }))}
          className="col-span-12 md:col-span-8"
        />
      </div>
    </div>
  );
};

export default ServicesFormFields;
