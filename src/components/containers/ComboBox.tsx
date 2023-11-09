import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Country, State, City }  from 'country-state-city';

import { ICountry, IState, ICity } from 'country-state-city';

interface ComboBoxProps {
  selectedCountry: ICountry | null;
  setSelectedCountry: (country: ICountry | null) => void;
  selectedState: IState | null;
  setSelectedState: (state: IState | null) => void;
  selectedCity: ICity | null;
  setSelectedCity: (city: ICity | null) => void;
  onChange?: (changed: boolean) => void;
  onSelectChange: (name: string, value: ICountry | IState | ICity | null) => void;
}

export default function ComboBox(props: ComboBoxProps) {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    if (props.selectedCountry) {
      const countryStates = State.getStatesOfCountry(props.selectedCountry.isoCode);
      setStates(countryStates);
    }
    if (props.selectedState && props.selectedCountry) {
      const stateCities = City.getCitiesOfState(props.selectedCountry.isoCode, props.selectedState.isoCode);
      setCities(stateCities);
    }
  }, [props.selectedCountry, props.selectedState]);

  const handleCountryChange = (e: React.ChangeEvent<object>, value: ICountry | null) => {
    e.preventDefault();
    props.setSelectedCountry(value);
    props.setSelectedState(null);
    props.setSelectedCity(null);
    props.onSelectChange('country', value);

    if (value) {
      const countryStates = State.getStatesOfCountry(value.isoCode);
      setStates(countryStates);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<object>, value: IState | null) => {
    e.preventDefault();
    props.setSelectedState(value);
    props.setSelectedCity(null);
    props.onSelectChange('state', value);

    if (value && props.selectedCountry) {
      const stateCities = City.getCitiesOfState(props.selectedCountry.isoCode, value.isoCode);
      setCities(stateCities);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<object>, value: ICity | null) => {
    e.preventDefault();
    props.setSelectedCity(value);
    props.onSelectChange('city', value);
  };

  return (
    <>
      <Autocomplete
        disablePortal
        getOptionLabel={(country) => country.name}
        options={countries}
        value={props.selectedCountry}
        onChange={handleCountryChange}
        sx={{ marginBottom: '1rem' }}
        isOptionEqualToValue={
          (option, value) => option.isoCode === value?.isoCode
        }
        renderInput={
          (params) =>
            <TextField {...params} label="Country" />
        }
      />
      <Autocomplete
        disablePortal
        options={states}
        getOptionLabel={(state) => state.name}
        value={props.selectedState}
        onChange={handleStateChange}
        sx={{ marginBottom: '1rem' }}
        isOptionEqualToValue={(option, value) => {
          return option.isoCode === value?.isoCode
        }}
        renderInput={
          (params) =>
            <TextField {...params} label="State" />
        }
        disabled={!props.selectedCountry}
      />
      <Autocomplete
        disablePortal
        options={cities}
        getOptionLabel={(city) => city.name}
        onChange={handleCityChange}
        value={props.selectedCity}
        renderInput={
          (params) =>
            <TextField {...params} label="City" />
        }
        isOptionEqualToValue={(option, value) => {
          return option.name === value?.name
        }}
        sx={{ marginBottom: '1rem' }}
        disabled={!props.selectedState || cities.length === 0}
      />
    </>
  );
}