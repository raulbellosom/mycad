import React, { useState } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Asegúrate de importar los estilos de Draft.js
import { Label } from 'flowbite-react';
import { ErrorMessage } from 'formik';
import classNames from 'classnames';

const RichTextEditor = ({
  className,
  field,
  form: { setFieldValue, touched, errors },
  label,
  ...props
}) => {
  // Inicializa el estado del editor desde el valor de Formik, si existe
  const initialEditorState = field.value
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(field.value)))
    : EditorState.createEmpty();

  const [editorState, setEditorState] = useState(initialEditorState);

  const handleEditorChange = (newState) => {
    setEditorState(newState);

    // Convierte el contenido del editor a un formato JSON que Formik pueda manejar
    const contentState = newState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    // Establece el valor del campo en Formik
    setFieldValue(field.name, rawContent);
  };

  return (
    <div className={classNames('relative w-full', className)}>
      <Label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium"
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        value={label}
      />
      <div
        className={classNames(
          'mt-1 border p-2 min-h-[150px]',
          touched[field.name] && errors[field.name]
            ? 'border-red-500'
            : 'border-gray-300',
        )}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          {...props}
        />
      </div>
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default RichTextEditor;
