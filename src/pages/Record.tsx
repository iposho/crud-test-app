import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetRecordByIdQuery,
} from '../store/api/server.api.ts';

import { ICountry, IState, ICity } from 'country-state-city'
import { IRecord } from '../models/models.ts';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Modal from '../components/ui/Modal.tsx'

import useCreateOrUpdateRecord from '../hooks/useCreateOrUpdateRecord.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import initialData from '../constants/recordInitialData.ts';
import RecordForm from '../components/containers/RecordForm.tsx';

export default function Record() {
  const { id } = useParams();
  const numericId = Number(id);

  const navigate = useNavigate();

  const isEditing = !!id;

  const { data, isLoading, isError } = useGetRecordByIdQuery(id || '', {
    skip: !isEditing,
    refetchOnMountOrArgChange: true,
  });

  console.log(data);

  const { createRecord, updateRecord } = useCreateOrUpdateRecord();
  const { deleteRecord } = useDeleteRecord();

  const [formData, setFormData] = useState<IRecord>(initialData);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalButtonsHide, setIsModalButtonsHide] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [inputChanges, setInputChanges] = useState({});
  const [newRecordId, setNewRecordId]=useState(null)

  useEffect(() => {
    if (Array.isArray(data) && data.length === 0) {
      navigate('/');
    } else if (data && Array.isArray(data) && isEditing) {
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
  }, [data, isEditing, navigate]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputChanges({ ...inputChanges, [name]: value });

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

  const handleSelectChange = (name: string, value: ICountry | IState | ICity | null) => {
    console.log(value);
    setInputChanges({
      ...inputChanges,
      profile: {
        ...formData.profile,
        [name]: value
      }
    });
  }

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

      const response = await createRecord(updatedFormData);

      if (response && 'error' in response) {
        console.error('Error when creating record', response.error);
      } else {
        setIsModalOpen(true);
        setNewRecordId(response.data.id);
        setSuccessMessage(`Record with id ${response.data.id} successfully created`);
        console.log(`Record with id ${response.data.id} successfully created`, response.data);
      }
    }
  };

  const handleUpdate = async () => {

    if (id && selectedCountry) {
      const updatedProfile = {
        country: selectedCountry,
        state: selectedState || null,
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

      const response = await updateRecord(numericId, updatedFormData);

      if (response && 'error' in response) {
        console.error('Error during record update', response.error);
      } else {
        setIsModalOpen(true);
        setSuccessMessage(`Record with id ${numericId} has been successfully updated`);
        console.log(`Record with id ${numericId} has been successfully updated`, response.data);
        navigate('/', { state: { id: numericId } })
      }
    }
  };

  const handleModalClose = () => {
    if (isModalButtonsHide) {
      navigate('/', { state: { id } })
    }
    setIsModalOpen(false);
  }

  const handleDelete = () => {
    if (id) {
      setIsDeleting(true);
      setSuccessMessage(`Deleting record with id ${id}`)
      setIsModalOpen(true);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (id) {
      await deleteRecord(numericId);
      setSuccessMessage(`Record with id ${numericId} has been successfully deleted`);
      setIsModalButtonsHide(true);
      console.log(`Record with id ${numericId} has been successfully deleted`);
    }
  }

  return (
    (Array.isArray(data) && data.length > 0 || !isEditing) &&
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
              onSelectChange={handleSelectChange}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              inputChanges={inputChanges}
            />
          )}
        </Box>
        <Modal
          open={isModalOpen}
          onClose={handleModalClose}
          message={successMessage}
          id={numericId || newRecordId}
          isEditing={isEditing}
          isDeleting={isDeleting}
          onDeleteButtonClick={handleDeleteButtonClick}
          isButtonsHide={isModalButtonsHide}
        />
      </Container>
  )
}