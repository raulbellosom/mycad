import React from 'react';
import { Field, FieldArray } from 'formik';
import TextInput from '../../Inputs/TextInput';
import TextArea from '../../Inputs/TextArea';
import FileInput from '../../Inputs/FileInput';
import { FaRegTrashAlt } from 'react-icons/fa';
import SingleSelectInput from '../../Inputs/SingleSelectInput';
import { IoMdAddCircleOutline } from 'react-icons/io';

const ServicesFormFields = ({ vehicles }) => {
  return (
    <div className="space-y-6 pb-10">
      {/* Selección de Vehículo */}
      <div>
        <Field
          name="vehicleId"
          id="vehicleId"
          component={SingleSelectInput}
          label="Vehículo"
          options={vehicles.map((vehicle) => ({
            label: `(${vehicle.model.year}) - ${vehicle.model.name} -${vehicle.plateNumber} - [${vehicle.model.brand.name} / ${vehicle.model.type.name}]`,
            value: vehicle.id,
          }))}
          className="w-full"
        />
      </div>

      {/* Tipo de Reporte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de reporte
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <Field
              type="radio"
              name="reportType"
              value="PREVENTIVE"
              className="h-4 w-4"
            />
            <span className="text-sm">Mantenimiento</span>
          </label>
          <label className="flex items-center space-x-2">
            <Field
              type="radio"
              name="reportType"
              value="CORRECTIVE"
              className="h-4 w-4"
            />
            <span className="text-sm">Servicio</span>
          </label>
        </div>
      </div>

      {/* Fecha del Servicio */}
      <div>
        <Field
          name="serviceDate"
          id="serviceDate"
          component={TextInput}
          label="Fecha del servicio"
          type="date"
          className="w-full"
        />
      </div>

      {/* Descripción */}
      <div>
        <Field
          name="description"
          id="description"
          component={TextArea}
          label="Descripción"
          placeholder="Detalle el mantenimiento o servicio realizado"
          rows="4"
          className="w-full"
        />
      </div>

      {/* Costo Total */}
      <div>
        <Field
          name="totalCost"
          id="totalCost"
          component={TextInput}
          label="Costo total"
          type="number"
          placeholder="0.00"
          className="w-full"
        />
      </div>

      {/* Partes Reemplazadas */}
      <div className="flex flex-col gap-4 relative pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partes reemplazadas o reparadas
        </label>
        <FieldArray name="replacedParts">
          {({ push, remove, form }) => (
            <>
              <button
                type="button"
                onClick={() => push({ partName: '', actionType: '', cost: 0 })}
                className="text-blue-500 hover:text-white hover:bg-blue-500 transition-all ease-in-out duration-200 text-sm border p-2 rounded-md absolute right-2 top-1"
              >
                <IoMdAddCircleOutline
                  size={'1.2rem'}
                  className="inline-block mr-2"
                />
                Agregar parte
              </button>
              {form.values.replacedParts?.map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-start gap-4 mb-2 border p-4 rounded-md  relative pt-8"
                >
                  <div className="flex justify-end absolute right-2 top-2">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:underline text-sm hover:bg-neutral-100 p-2 rounded-md"
                    >
                      <span>
                        <FaRegTrashAlt size={'1.4rem'} />
                      </span>
                    </button>
                  </div>
                  <div className="flex-1 w-full flex-col">
                    <label
                      htmlFor={`replacedParts[${index}].partName`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre de la parte
                    </label>
                    <Field
                      name={`replacedParts[${index}].partName`}
                      id={`replacedParts[${index}].partName`}
                      component={TextInput}
                      placeholder="Nombre de la parte"
                    />
                  </div>
                  <div className="flex-1 w-full flex flex-col  gap-2 justify-start">
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de acción
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Field
                          type="radio"
                          id={`replacedParts[${index}].actionType.REPLACED`}
                          name={`replacedParts[${index}].actionType`}
                          value="REPLACED"
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`replacedParts[${index}].actionType.REPLACED`}
                          className="text-sm"
                        >
                          Reemplazada
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Field
                          type="radio"
                          id={`replacedParts[${index}].actionType.REPAIRED`}
                          name={`replacedParts[${index}].actionType`}
                          value="REPAIRED"
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`replacedParts[${index}].actionType.REPAIRED`}
                          className="text-sm"
                        >
                          Reparada
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full flex-col">
                    <label
                      htmlFor={`replacedParts[${index}].cost`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Costo
                    </label>
                    <Field
                      name={`replacedParts[${index}].cost`}
                      id={`replacedParts[${index}].cost`}
                      component={TextInput}
                      placeholder="Costo"
                      type="number"
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </FieldArray>
      </div>

      {/* Comentarios Adicionales */}
      <div>
        <Field
          name="comments"
          id="comments"
          component={TextArea}
          label="Comentarios adicionales (opcional)"
          placeholder="Agregue cualquier observación adicional"
          rows="4"
          className="w-full"
        />
      </div>

      {/* Archivos Adjuntos */}
      <div>
        <Field
          name="attachments"
          id="attachments"
          component={FileInput}
          label="Archivos adjuntos (opcional)"
          multiple
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ServicesFormFields;
