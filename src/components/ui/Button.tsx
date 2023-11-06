import React from 'react';
import MUIButton from '@mui/material/Button';

interface ButtonProps {
  disabled?: boolean;
  type: 'submit' | 'button' | 'reset';
  onClick: () => void;
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  sx?: object;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  type = 'button',
  onClick,
  variant = 'contained',
  children,
  sx,
  color
}) => {
  return (
    <MUIButton
      variant={variant}
      type={type}
      onClick={onClick}
      sx={sx}
      color={color}
      disabled={disabled}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
