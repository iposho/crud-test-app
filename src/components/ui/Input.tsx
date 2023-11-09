import React, { ChangeEvent } from 'react';

import TextField from '@mui/material/TextField';

interface InputFieldProps {
  type?: string;
  error?: boolean;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  sx?: object;
  helperText?: string;
}

const Input: React.FC<InputFieldProps> = ({
  name,
  error,
  value,
  onChange,
  placeholder,
  label = '',
  required = false,
  sx = { my: '.5rem' },
  helperText
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
      error={error}
      helperText={helperText}
      fullWidth
    />
  );
};

export default Input;
