import React, { ChangeEvent } from 'react';

import TextField from '@mui/material/TextField';

interface InputFieldProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  sx?: object;
}

const Input: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label = '',
  required = false,
  sx = { my: '.5rem' },
}) => {
  return (
    <TextField
      label={label}
      onChange={onChange}
      required={required}
      name={name}
      value={value}
      placeholder={placeholder}
      sx={sx}
      fullWidth
    />
  );
};

export default Input;
