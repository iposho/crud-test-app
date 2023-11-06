import React, { useState } from 'react';

import Input from '../ui/Input.tsx'
import Button from '../ui/Button.tsx'
import ComboBox from './ComboBox.tsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Checkbox } from '@mui/material';

import { IRecord } from '../../models/models.ts';
import { ICountry, IState, ICity } from 'country-state-city';

interface RecordFormProps {
  isEditing: boolean;
  formData: IRecord;
  selectedCountry: ICountry | null;
  setSelectedCountry: (country: ICountry | null) => void;
  selectedState: IState | null;
  setSelectedState: (state: IState | null) => void;
  selectedCity: ICity | null;
  setSelectedCity: (city: ICity | null) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function RecordForm({
  isEditing,
  formData,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  onInputChange,
  onCreate,
  onUpdate,
  onDelete,
}: RecordFormProps) {
  const [radioButtonValue, setRadioButtonValue] = useState('');

  const [checkBoxState, setCheckBoxState] = React.useState({
    accept: false,
    updates: false,
  });

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue((event.target as HTMLInputElement).value);
  };

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  const { accept, updates } = checkBoxState;
  const isButtonDisabled =  !radioButtonValue || radioButtonValue === 'license' && !accept;

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          margin: '1rem 0 1.5rem 0',
        }}
      >
        {!isEditing ? 'Create new record' : `Edit record id: ${formData.id}`}
      </Typography>
      <Input
        name="email"
        value={formData.email}
        onChange={onInputChange}
        label="Email"
      />
      <Input
        name="profile.name"
        value={formData.profile.name}
        onChange={onInputChange}
        label="Name"
        sx={{ marginBottom: '1rem' }}
      />
      <ComboBox
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
      <Box>
        {
          !isEditing &&
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '1.5rem'
            }}
            value={radioButtonValue}
            onChange={handleRadioButtonChange}
          >
            <FormControlLabel value="license" control={<Radio />} label="By license agreement" />
            <FormControlLabel value="mutual" control={<Radio />} label="By mutual agreement" />
          </RadioGroup>
        }
      </Box>
      <FormGroup sx={{ marginTop: '-1.25rem', marginBottom: '1.5rem' }}>
        {
          radioButtonValue === 'license' &&
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accept}
                  required
                  onChange={handleCheckBoxChange}
                  name="accept"
                />
              }
              label="I accept the terms of the license agreement"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={updates}
                  onChange={handleCheckBoxChange}
                  name="updates" />
              }
              label="Send me updates by email"
            />
          </>
        }
        {
          radioButtonValue === 'mutual' &&
          <FormControlLabel
            control={
              <Checkbox
                checked={updates}
                onChange={handleCheckBoxChange}
                name="updates" />
            }
            label="Send me updates by email"
          />
        }
      </FormGroup>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {isEditing ? (
          <>
            <Button
              disabled={isButtonDisabled}
              type="submit"
              onClick={onUpdate}
            >
              Update
            </Button>
            <Button
              type="button"
              onClick={onDelete}
              sx={{
                backgroundColor: 'red',
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={onCreate}
            disabled={!isEditing && isButtonDisabled}
          >
            Create
          </Button>
        )}
      </Box>
    </>
  );
}
