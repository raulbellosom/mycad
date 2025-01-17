import React from 'react';
import { Field } from 'formik';
import TextInput from '../../Inputs/TextInput';
import SelectInput from '../../Inputs/SelectInput';
import DateInput from '../../Inputs/DateInput';
import TextArea from '../../Inputs/TextArea';
import FileInput from '../../Inputs/FileInput';
import {
  MdInfo,
  MdCalendarToday,
  MdOutlineNumbers,
  MdOutlineCurrencyExchange,
} from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { IoLogoModelS } from 'react-icons/io';
import MultiSelectInput from '../../Inputs/MultiSelectInput';
import ImagePicker from '../../Inputs/ImagePicker';
import { FaTachometerAlt } from 'react-icons/fa';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { TbNumber123 } from 'react-icons/tb';
import SingleSelectInput from '../../Inputs/SingleSelectInput';

const VehicleFormFields = ({
  vehicleModels,
  vehicleConditions,
  onOtherSelected,
}) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-0">
    <div className="col-span-12 lg:col-span-8 lg:w-[97%]">
      <div className="grid grid-cols-12 gap-2">
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            borderBottom: '1px solid #e2e8f0',
            lineHeight: '0.1em',
            margin: '10px 0 20px',
          }}
          className="col-span-12 text-base font-semibold"
        >
          <span style={{ background: '#fff', padding: '0 10px' }}>
            Información General del Vehículo
          </span>
        </p>
        <Field
          name="modelId"
          id="modelId"
          component={SingleSelectInput}
          icon={IoLogoModelS}
          label="* Modelo"
          options={vehicleModels.map((model) => ({
            label: model.name,
            value: model.id,
          }))}
          isOtherOption={true}
          onOtherSelected={onOtherSelected}
          className="col-span-12 md:col-span-8"
        />
        <Field
          name="economicNumber"
          id="economicNumber"
          component={TextInput}
          icon={MdOutlineNumbers}
          label="Número Económico"
          className="col-span-6 md:col-span-4"
        />
        <Field
          name="serialNumber"
          id="serialNumber"
          component={TextInput}
          icon={TbNumber123}
          label="Número de Serie"
          className="col-span-6 md:col-span-4"
        />
        <Field
          name="plateNumber"
          id="plateNumber"
          component={TextInput}
          icon={AiOutlineFieldNumber}
          label="Número de Placa"
          className="col-span-6 md:col-span-4"
        />
        <Field
          name="mileage"
          id="mileage"
          component={TextInput}
          label="* Kilometraje"
          icon={FaTachometerAlt}
          type="number"
          min={0}
          className="col-span-6 md:col-span-4"
        />
        <Field
          name="acquisitionDate"
          id="acquisitionDate"
          component={DateInput}
          label="* Fecha de Adquisición"
          title="Fecha de Adquisición"
          icon={MdCalendarToday}
          max={new Date().toISOString().split('T')[0]}
          className="col-span-6 md:col-span-4"
        />
        <Field
          name="status"
          id="status"
          component={SelectInput}
          icon={MdInfo}
          label="* Estado"
          options={[
            { label: 'Activo', value: true },
            { label: 'Inactivo', value: false },
          ]}
          className="col-span-12 md:col-span-4"
        />
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            borderBottom: '1px solid #e2e8f0',
            lineHeight: '0.1em',
            margin: '10px 0 20px',
          }}
          className="col-span-12 text-base font-semibold pt-4"
        >
          <span style={{ background: '#fff', padding: '0 10px' }}>
            Contabilidad del Vehículo
          </span>
        </p>

        <Field
          name="cost"
          id="cost"
          component={TextInput}
          icon={BiDollar}
          label="Costo de Adquisición"
          type="number"
          className="col-span-6"
          min={0}
        />
        <Field
          name="costCurrency"
          id="costCurrency"
          component={SelectInput}
          icon={MdOutlineCurrencyExchange}
          label="Moneda"
          className="col-span-6"
          options={[
            { label: 'Pesos Mexicanos', value: 'MXN' },
            { label: 'Dolares Americanos', value: 'USD' },
          ].map((cost) => ({
            label: cost.label,
            value: cost.value,
          }))}
        />
        <Field
          name="bookValue"
          id="bookValue"
          component={TextInput}
          icon={BiDollar}
          label="Valor en Libros"
          type="number"
          className="col-span-6"
          min={0}
        />
        <Field
          name="bookValueCurrency"
          id="bookValueCurrency"
          component={SelectInput}
          icon={MdOutlineCurrencyExchange}
          label="Moneda"
          className="col-span-6"
          options={[
            { label: 'Pesos Mexicanos', value: 'MXN' },
            { label: 'Dolares Americanos', value: 'USD' },
          ].map((cost) => ({
            label: cost.label,
            value: cost.value,
          }))}
        />
        <Field
          name="currentMarketValue"
          id="currentMarketValue"
          component={TextInput}
          icon={BiDollar}
          label="Valor en el Mercado"
          type="number"
          className="col-span-6"
          min={0}
        />
        <Field
          name="marketValueCurrency"
          id="marketValueCurrency"
          component={SelectInput}
          icon={MdOutlineCurrencyExchange}
          label="Moneda"
          className="col-span-6"
          options={[
            { label: 'Pesos Mexicanos', value: 'MXN' },
            { label: 'Dolares Americanos', value: 'USD' },
          ].map((cost) => ({
            label: cost.label,
            value: cost.value,
          }))}
        />

        <p
          style={{
            width: '100%',
            textAlign: 'center',
            borderBottom: '1px solid #e2e8f0',
            lineHeight: '0.1em',
            margin: '10px 0 20px',
          }}
          className="col-span-12 text-base font-semibold pt-4"
        >
          <span style={{ background: '#fff', padding: '0 10px' }}>
            Información Adicional
          </span>
        </p>
        <Field
          name="conditions"
          id="conditions"
          component={MultiSelectInput}
          icon={MdInfo}
          label="Condición del Vehículo"
          options={vehicleConditions.map((condition) => ({
            label: condition.name,
            value: condition.id,
          }))}
          className="col-span-12"
        />
        <Field
          name="comments"
          id="comments"
          component={TextArea}
          label="Observaciones"
          className="col-span-12"
        />
        <Field
          name="files"
          id="files"
          component={FileInput}
          label="Archivos"
          className="col-span-12"
          multiple
          helperText="PDF, Word, Excel, Imagenes, Rar, Zip"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.rar,.zip,.tar,.gz,.ppt,.pptx,.mp4,.avi,.mov,.json,.xml"
        />
      </div>
    </div>
    <div className="col-span-12 lg:col-span-4 h-full">
      <div className="w-full h-full">
        <Field
          name="images"
          id="images"
          component={ImagePicker}
          label="Imagenes"
          multiple
          accept="image/*"
        />
      </div>
    </div>
  </div>
);

export default VehicleFormFields;
