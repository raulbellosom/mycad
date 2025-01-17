import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 bg-white dark:bg-gray-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-mycad"
      >
        {options.find((option) => option.value === selected)?.label || label}
        <FaChevronDown size={14} className="ml-2 text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full md:w-auto bg-white dark:bg-gray-800 shadow-md rounded-md">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selected === option.value ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
