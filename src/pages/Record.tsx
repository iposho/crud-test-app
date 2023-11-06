import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetRecordByIdQuery,
} from '../store/api/server.api.ts';

import { ICountry, IState, ICity } from 'country-state-city'

import Input from '../components/ui/Input.tsx';
import Button from '../components/ui/Button.tsx';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import useCreateOrUpdateRecord from '../hooks/useCreateOrUpdateRecord.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import { IRecord } from '../models/models.ts';
import ComboBox from '../components/ui/ComboBox.tsx';

import initialData from '../constants/recordInitialData.ts';

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
    if (selectedCountry && selectedState && selectedCity) {
      await createRecord({
        ...formData,
        profile: {
          ...formData.profile,
          country: selectedCountry,
          state: selectedState,
          city: selectedCity,
        }
      });
    }
  };

  const handleUpdate = async () => {
    if (id) {
      await updateRecord(id, formData);
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
          <div>
            <Typography
              variant="h4"
              sx={{
                margin: '1rem 0 1.5rem 0'
              }}
            >
              {!isEditing ? 'Create new record' : 'Edit record id:' + formData.id}
            </Typography>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
            />
            <Input
              name="profile.name"
              value={formData.profile.name}
              onChange={handleInputChange}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {
                isEditing
                  ? <>
                    <Button
                      type="submit"
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDelete}
                      sx={{
                        backgroundColor: 'red'
                      }}
                    >
                      Delete
                    </Button>
                  </>
                  : <Button
                    type="button"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
              }
            </Box>
          </div>
        )}
      </Box>
    </Container>
  )
}