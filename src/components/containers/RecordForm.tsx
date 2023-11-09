import React, { ChangeEvent, useState } from 'react';

import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Checkbox } from '@mui/material';

import Input from '../ui/Input.tsx';
import Button from '../ui/Button.tsx';
import ComboBox from './ComboBox.tsx';

import { IRecord } from '../../models/models.ts';
import { ICountry, IState, ICity } from 'country-state-city';

import { isEmailValid, isNameValid, isPhoneValid } from '../../helpers/validation.ts';

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
  onSelectChange: (name: string, value: ICountry | IState | ICity | null) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  inputChanges: object;
}

export default function RecordForm({
  isEditing,
  formData,
  inputChanges,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  onInputChange,
  onSelectChange,
  onCreate,
  onUpdate,
  onDelete,
}: RecordFormProps) {
  const [radioButtonValue, setRadioButtonValue] = useState('');
  const [repeatEmail, setRepeatEmailValue] = useState('')

  const [checkBoxState, setCheckBoxState] = useState({
    accept: false,
    updates: false,
  });

  const [inputTouched, setInputTouched] = useState({
    name: false,
    email: false,
    phone: false,
    repeatEmail: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'profile.name') {
      setInputTouched({ ...inputTouched, name: !isNameValid(value) });
    } else {
      setInputTouched({ ...inputTouched, [name]: true });
    }

    onInputChange(e);
  };

  const handleRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue((event.target as HTMLInputElement).value);
  };

  const handleCheckBoxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleRepeatEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRepeatEmailValue(event.target.value);
  };

  const { accept, updates } = checkBoxState;
  const isInputsValid = isNameValid(formData.profile.name) && isEmailValid(formData.email);
  const isCheckboxesValid = radioButtonValue === 'mutual' || (radioButtonValue === 'license' && accept);

  const isButtonDisabled = !isInputsValid && !isCheckboxesValid;

  return (
    <form>
      <Typography variant="h4" sx={{ margin: '1rem 0 1.5rem 0' }}>
        {!isEditing ? 'Create new record' : `Edit record id: ${formData.id}`}
      </Typography>
      <Input
        name="profile.name"
        value={formData.profile.name}
        onChange={handleInputChange}
        label="Name"
        sx={{ marginBottom: '1rem' }}
        error={inputTouched.name && !isNameValid(formData.profile.name)}
        helperText={
          inputTouched.name && !isNameValid(formData.profile.name)
            ? 'Please enter a valid name (3-100 characters)'
            : ''
        }
      />
      <Input
        name="phone"
        value={formData.profile.phone}
        onChange={handleInputChange}
        label="Phone"
        sx={{ marginBottom: '1rem' }}
        error={inputTouched.phone && !isPhoneValid(formData.profile.phone)}
        helperText={
          inputTouched.phone && !isPhoneValid(formData.profile.phone)
            ? 'Please enter a valid phone number'
            : ''
        }
      />
      <Input
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        label="Email"
        sx={{ marginBottom: '1rem' }}
        error={inputTouched.email && !isEmailValid(formData.email)}
        helperText={
          inputTouched.email && !isEmailValid(formData.email)
            ? 'Please enter a valid email'
            : ''
        }
      />
      {
        !isEditing &&
        <Input
          name="repeatEmail"
          value={repeatEmail}
          onChange={handleRepeatEmailChange}
          label="Repeat Email"
          sx={{ marginBottom: '1rem' }}
          error={formData.email !== repeatEmail}
          helperText={formData.email !== repeatEmail ? 'Emails do not match' : ''}
        />
      }
      <ComboBox
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onSelectChange={onSelectChange}
      />
      <FormGroup>
        {!isEditing && (
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '1.5rem',
            }}
            value={radioButtonValue}
            onChange={handleRadioButtonChange}
          >
            <FormControlLabel value="license" control={<Radio />} label="By license agreement" />
            <FormControlLabel value="mutual" control={<Radio />} label="By mutual agreement" />
          </RadioGroup>
        )}
      </FormGroup>
      <FormGroup sx={{ marginTop: '-1.25rem', marginBottom: '1.5rem' }}>
        {radioButtonValue === 'license' &&
          <>
            <FormControlLabel
              control={
                <Checkbox checked={accept} required onChange={handleCheckBoxChange} name="accept" />
              }
              label="I accept the terms of the license agreement"
            />
            <FormControlLabel
              control={
                <Checkbox checked={updates} onChange={handleCheckBoxChange} name="updates" />
              }
              label="Send me updates by email"
            />
          </>
        }
        {radioButtonValue === 'mutual' &&
          <FormControlLabel
            control={
              <Checkbox checked={updates} onChange={handleCheckBoxChange} name="updates" />
            }
            label="Send me updates by email"
          />
        }
      </FormGroup>
      <FormGroup sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
        {isEditing ? (
          <>
            <Button
              disabled={isEditing && Object.keys(inputChanges).length === 0}
              type="button"
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
            disabled={isButtonDisabled}
          >
            Create
          </Button>
        )}
      </FormGroup>
    </form>
  );
}
