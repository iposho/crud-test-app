import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const Input: React.FC<InputFieldProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  className = '',
  placeholder,
  label = '',
  required = false,
}) => {
  return (
    <div className="relative z-0 w-full mb-6 group">
      <input
        type={type}
        name={name}
        id={name}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900
         bg-transparent border-0 border-b-2 border-gray-300 appearance-none
         focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={name}
        className="peer-focus:font-medium
         absolute text-sm text-gray-500
         transform -translate-y-6 scale-75
         top-3 -z-10 origin-[0]
         peer-focus:left-0 peer-focus:text-blue-600
         peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100
         peer-placeholder-shown:translate-y-0 peer-focus:scale-75
         peer-focus:-translate-y-6">
        {label}
      </label>
    </div>
  );
};

export default Input;
