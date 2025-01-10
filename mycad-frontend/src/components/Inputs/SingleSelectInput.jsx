import React from 'react';
import { ErrorMessage } from 'formik';
import { Label } from 'flowbite-react';
import classNames from 'classnames';
import Select from 'react-select';

const SingleSelectInput = ({
  field,
  className,
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  const handleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    setFieldValue(field.name, value);
  };

  return (
    <div className={classNames('w-full', className)}>
      <Label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium"
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        value={props.label}
      />
      <Select
        {...field}
        {...props}
        className="mt-1 border border-gray-500 rounded-lg"
        classNamePrefix="react-select"
        onChange={handleChange}
        value={props.options.find((option) => option.value === field.value)}
        options={props.options}
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default SingleSelectInput;
