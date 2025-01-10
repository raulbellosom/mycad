import React from 'react';
import { Field } from 'formik';
import TextInput from '../../Inputs/TextInput';
import SelectInput from '../../Inputs/SelectInput';
import { BiCategory } from 'react-icons/bi';
import { PiTrademarkRegisteredBold } from 'react-icons/pi';
import { MdOutlineDirectionsCar } from 'react-icons/md';
import { FaCalendar } from 'react-icons/fa';
import SingleSelectInput from '../../Inputs/SingleSelectInput';

const ModelFormFields = ({ vehicleBrands, vehicleTypes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
      <Field
        name="brandId"
        id="brandId"
        component={SingleSelectInput}
        label="Marca"
        options={vehicleBrands.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }))}
        icon={PiTrademarkRegisteredBold}
      />
      <Field
        name="typeId"
        id="typeId"
        component={SingleSelectInput}
        label="Tipo de Vehículo"
        options={vehicleTypes.map((type) => ({
          label: type.name,
          value: type.id,
        }))}
        icon={BiCategory}
      />
      <Field
        className="hidden"
        name="id"
        label="id"
        component={TextInput}
        type="hidden"
        disabled={true}
      />
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre"
        type="text"
        icon={MdOutlineDirectionsCar}
      />
      <Field
        name="year"
        id="year"
        component={TextInput}
        label="Año del modelo"
        type="number"
        icon={FaCalendar}
      />
    </div>
  );
};

export default ModelFormFields;
