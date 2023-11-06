import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetRecordByIdQuery,
} from '../store/api/server.api.ts';

import { ICountry, IState, ICity } from 'country-state-city'
import { IRecord } from '../models/models.ts';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import useCreateOrUpdateRecord from '../hooks/useCreateOrUpdateRecord.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import initialData from '../constants/recordInitialData.ts';
import RecordForm from '../components/containers/RecordForm.tsx';

export default function Record() {
  const { id } = useParams();

  const isEditing = !!id;

  const { data, isLoading, isError } = useGetRecordByIdQuery(id || '', {
    skip: !isEditing,
  });

  const { createRecord, updateRecord } = useCreateOrUpdateRecord();
  const { deleteRecord } = useDeleteRecord();

  const [formData, setFormData] = useState<IRecord>(initialData);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  useEffect(() => {
    if (data && Array.isArray(data) && isEditing) {
      const recordData = data[0];
      setFormData(recordData);
      setSelectedCountry(recordData.profile.country);
      setSelectedState(recordData.profile.state);
      setSelectedCity(recordData.profile.city);
    } else {
      setFormData(initialData)
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [data, isEditing]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('profile.')) {
      const profileName = name.split('profile.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileName]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCreate = async () => {
    if (selectedCountry && selectedState) {
      const updatedProfile = {
        country: selectedCountry,
        state: selectedState,
        city: selectedCity || null,
      };

      if (selectedCity) {
        updatedProfile.city = selectedCity;
      }

      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          ...updatedProfile,
        },
      };

      await createRecord(updatedFormData);
    }
  };

  const handleUpdate = async () => {

    if (id && selectedCountry && selectedState) {
      const updatedProfile = {
        country: selectedCountry,
        state: selectedState,
        city: selectedCity || null,
      };

      if (selectedCity) {
        updatedProfile.city = selectedCity;
      }

      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          ...updatedProfile,
        },
      };

      await updateRecord(id, updatedFormData);
    }
  };


  const handleDelete = async () => {
    if (id) {
      await deleteRecord(id);
    }
  };

  return (
    <Container sx={{ width: '100%' }}>
      {isError && <Typography className="text-red">Something went wrong...</Typography>}
      <Box>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <RecordForm
            isEditing={isEditing}
            formData={formData}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onInputChange={handleInputChange}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </Box>
    </Container>
  )
}