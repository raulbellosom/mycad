import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import TextArea from '../Inputs/TextArea';
import FileInput from '../Inputs/FileInput';
import DateInput from '../Inputs/DateInput';
import SelectInput from '../Inputs/SelectInput';
import { MdLocationOn, MdAttachMoney, MdCalendarToday } from 'react-icons/md';
import { FaTachometerAlt } from 'react-icons/fa';
import SingleSelectInput from '../Inputs/SingleSelectInput';

const RentalFormFields = ({ vehicles, clients }) => (
  <div className="grid grid-cols-12 gap-6">
    {/* Información Principal */}
    <div className="col-span-12 border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Información Principal</h2>
      <div className="grid grid-cols-12 gap-4">
        <Field
          name="vehicleId"
          id="vehicleId"
          component={SingleSelectInput}
          label="* Vehículo"
          options={vehicles.map((vehicle) => ({
            label: `(${vehicle.model.type.economicGroup}) ${vehicle.model?.name} - [${vehicle.model.brand?.name} / ${vehicle.model.type?.name}] (${vehicle.plateNumber})`,
            value: vehicle.id,
          }))}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="clientId"
          id="clientId"
          component={SingleSelectInput}
          label="* Cliente"
          options={clients.map((client) => ({
            label: client.name,
            value: client.id,
          }))}
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>

    {/* Fechas y Ubicaciones */}
    <div className="col-span-12 border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Fechas y Ubicaciones</h2>
      <div className="grid grid-cols-12 gap-4">
        <Field
          name="startDate"
          id="startDate"
          component={DateInput}
          icon={MdCalendarToday}
          label="* Fecha inicial"
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="endDate"
          id="endDate"
          component={DateInput}
          icon={MdCalendarToday}
          label="* Fecha de finalización"
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="pickupLocation"
          id="pickupLocation"
          component={TextInput}
          icon={MdLocationOn}
          label="Lugar de entrega"
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="dropoffLocation"
          id="dropoffLocation"
          component={TextInput}
          icon={MdLocationOn}
          label="Lugar de recepción"
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>

    {/* Información Financiera */}
    <div className="col-span-12 border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Información Financiera</h2>
      <div className="grid grid-cols-12 gap-4">
        <Field
          name="dailyRate"
          id="dailyRate"
          component={TextInput}
          icon={MdAttachMoney}
          label="Precio diario"
          type="number"
          min={0}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="deposit"
          id="deposit"
          component={TextInput}
          icon={MdAttachMoney}
          label="Depósito"
          type="number"
          min={0}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="totalCost"
          id="totalCost"
          component={TextInput}
          icon={MdAttachMoney}
          label="Costo total"
          type="number"
          min={0}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="paymentStatus"
          id="paymentStatus"
          component={SelectInput}
          label="Estado del pago"
          options={[
            { label: 'Pendiente', value: 'PENDING' },
            { label: 'Pagado', value: 'COMPLETED' },
            { label: 'Parcialmente Pagado', value: 'PARTIAL' },
            { label: 'Reembolsado', value: 'REFUNDED' },
          ]}
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>

    {/* Estado del Vehículo */}
    <div className="col-span-12 border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Estado del Vehículo</h2>
      <div className="grid grid-cols-12 gap-4">
        <Field
          name="initialMileage"
          id="initialMileage"
          component={TextInput}
          icon={FaTachometerAlt}
          label="Kilometraje inicial"
          type="number"
          min={0}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="finalMileage"
          id="finalMileage"
          component={TextInput}
          icon={FaTachometerAlt}
          label="Kilometraje final"
          type="number"
          min={0}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="fuelLevelStart"
          id="fuelLevelStart"
          component={TextInput}
          label="Nivel de combustible inicial (%)"
          type="number"
          min={0}
          max={100}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="fuelLevelEnd"
          id="fuelLevelEnd"
          component={TextInput}
          label="Nivel de combustible final (%)"
          type="number"
          min={0}
          max={100}
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>

    {/* Comentarios y Estado General */}
    <div className="col-span-12 border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">
        Comentarios y Estado General
      </h2>
      <div className="grid grid-cols-12 gap-4">
        <Field
          name="comments"
          id="comments"
          component={TextArea}
          label="Comentarios"
          className="col-span-12"
        />
        <Field
          name="status"
          id="status"
          component={SelectInput}
          label="Estado general de la renta"
          options={[
            { label: 'Activa', value: 'ACTIVE' },
            { label: 'Pendiente', value: 'PENDING' },
            { label: 'Completada', value: 'COMPLETED' },
            { label: 'Cancelada', value: 'CANCELED' },
          ]}
          className="col-span-12 md:col-span-6"
        />
        <Field
          name="files"
          id="files"
          component={FileInput}
          label="Archivos"
          className="col-span-12"
          multiple
          helperText="PDF, Word, Excel, Imágenes, Rar, Zip"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.rar,.zip,.tar,.gz,.ppt,.pptx,.mp4,.avi,.mov,.json,.xml,.csv,.jpg,.jpeg,.png,.gif,.svg,.tiff,.bmp"
        />
      </div>
    </div>
  </div>
);

export default RentalFormFields;
