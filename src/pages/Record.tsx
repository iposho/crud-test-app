import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  Autocomplete,
  Checkbox,
  Container,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
  TextField,
} from '@mui/material'

// import useFormPersist from 'react-hook-form-persist'

import { Country, State, City } from 'country-state-city';

import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';

import { useGetRecordByIdQuery } from '../store/api/server.api.ts';
import useCreateOrUpdateRecord from '../hooks/useCreateOrUpdateRecord.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import { ICountry, IState, ICity, IProfile, IRecord } from '../models/models.ts';


interface IForm {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  profile: IProfile;
  license: boolean;
  mutual: boolean;
  accept: boolean;
  confirmEmail: string;
  newsletters: boolean;
}

export default function Record() {
  const { id } = useParams();
  const isEditing = !!id;

  const numericId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetRecordByIdQuery(id || '', {
    skip: !isEditing,
    refetchOnMountOrArgChange: true,
  });

  const formData = (Array.isArray(data) && data.length > 0) && data[0];

  const { createRecord, updateRecord } = useCreateOrUpdateRecord();
  const { deleteRecord } = useDeleteRecord();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalButtonsHide, setIsModalButtonsHide] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [newRecordId, setNewRecordId]=useState(null)

  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: {
      errors
    },
    setValue,
    getValues,
    resetField,
  } = useForm<IForm>({
    defaultValues: useMemo(() => {
      if (isEditing) {
        return formData;
      }
    }, [formData, isEditing])
  });

  useEffect(() => {
    if (!formData && isEditing) {
      navigate('/');
    }
  }, [isEditing, formData, navigate]);

  // useFormPersist('crudForm', {
  //   watch,
  //   setValue,
  // });

  const email = watch('email');
  const country = watch('profile.country');
  const state = watch('profile.state');
  const city = watch('profile.city');
  const license = watch('license');
  const mutual = watch('mutual');
  const accept = watch('accept');

  const isButtonDisabled = () => {
    if ((license && !mutual)) {
      return !accept
    }

    return (!(mutual && !license));
  };

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
  const handleModalClose = () => {
    if (isModalButtonsHide) {
      navigate('/', { state: { id } })
    }
    setIsModalOpen(false);
  }

  const onSubmit: SubmitHandler<IRecord> = async (data) => {
    if (isEditing) {
      const response = await updateRecord(numericId, data);

      if (response && 'error' in response) {
        console.error('Error during record update', response.error);
      } else {
        setIsModalOpen(true);
        setSuccessMessage(`Record with id ${numericId} has been successfully updated`);
        console.log(`Record with id ${numericId} has been successfully updated`, response.data);
        navigate('/', { state: { id: numericId } })
      }
    } else {
      const response = await createRecord(data);

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


  return (
    (Array.isArray(data) && data.length > 0 || !isEditing) &&
    <Container sx={{ width: '100%' }}>
      {isError && <Typography className="text-red">Something went wrong...</Typography>}
      {
        isLoading
          ? <CircularProgress color="secondary" />
          : <>
            <Typography variant="h4" sx={{ margin: '1rem 0 1.5rem 0' }}>
              {!isEditing ? 'Create new record' : `Edit record id: ${formData.id}`}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1200px'
            }}>
              <TextField
                type={'text'}
                label="Name"
                sx={{ marginBottom: '1rem' }}
                {...register('profile.name',
                  { required: true, min: 3, max: 100, pattern: /^[A-Za-zА-Яа-я\s]+$/i })
                }
                error={!!errors.profile?.name}
                helperText={!!errors.profile?.name && 'Please enter a valid name (3-100 characters)'}
              />

              <TextField
                type="text"
                label="Phone"
                sx={{ marginBottom: '1rem' }}
                {...register('profile.phone',
                  { required: true, min: 5, pattern: /^[0-9+\s-]+$/ })}
                error={!!errors.profile?.phone}
                helperText={!!errors.profile?.phone && 'Please enter a valid phone number'}
              />

              <TextField
                type="email"
                label="Email"
                sx={{ marginBottom: '1rem' }}
                {...register('email',
                  { required: true, min: 4, pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i })}
                error={!!errors.email}
                helperText={!!errors.email && 'Please enter a valid email'}
              />

              {
                !isEditing &&
                <TextField
                  type="email"
                  label="Confirm Email"
                  sx={{ marginBottom: '1rem' }}
                  {...register('confirmEmail',
                    {
                      min: 4,
                      validate: {
                        emailEqual: value => (value === getValues('email'))
                      }
                    })}
                  error={!!errors?.confirmEmail}
                  helperText={!!errors?.confirmEmail && 'Emails do not match'}
                  disabled={!email}
                />
              }

              <Controller
                control={control}
                name="profile.country"
                rules={{
                  required: 'required'
                }}
                render={({ field }) => {
                  const { onChange, value } = field;

                  return <Autocomplete
                    disablePortal
                    getOptionLabel={(country) => country.name}
                    options={Country.getAllCountries()}
                    sx={{ marginBottom: '1rem' }}
                    value={value || null}
                    onChange={(_, newValue: ICountry | null) => {
                      onChange(newValue)

                      if (value !== newValue || !newValue) {
                        setValue('profile.state', null);
                        setValue('profile.city', null);
                      }
                    }}
                    isOptionEqualToValue={
                      (option, value) => option.isoCode === value?.isoCode
                    }
                    renderInput={
                      (params) =>
                        <TextField
                          {...params}
                          label="Country"
                          error={!!errors.profile?.country}
                          helperText={!!errors.profile?.country && 'Please select a country'}
                        />
                    }
                  />
                }}
              />

              <Controller
                control={control}
                name="profile.state"
                render={({ field }) => {
                  const { onChange, value } = field;

                  return <Autocomplete
                    disablePortal
                    value={value || null}
                    getOptionLabel={(state) => state.name}
                    disabled={!country}
                    options={(country)
                      ? State.getStatesOfCountry(getValues('profile.country').isoCode)
                      : []
                    }
                    sx={{ marginBottom: '1rem' }}
                    isOptionEqualToValue={
                      (option, value) => option.isoCode === value?.isoCode
                    }
                    onChange={(_, newValue: IState | null) => {
                      onChange(newValue)

                      if (city && (value !== newValue) || !newValue) {
                        resetField('profile.city')
                      }
                    }}
                    renderInput={
                      (params) =>
                        <TextField
                          {...params}
                          label="State"
                        />
                    }
                  />
                }}
              />

              <Controller
                control={control}
                name="profile.city"
                render={({ field }) => {
                  const { onChange, value } = field;

                  return <Autocomplete
                    disablePortal
                    value={value || null}
                    disabled={!state}
                    getOptionLabel={(city) => city.name}
                    options={(country && state)
                      ? City.getCitiesOfState(
                        getValues('profile.country')!.isoCode,
                        getValues('profile.state')!.isoCode
                      )
                      : []
                    }
                    sx={{ marginBottom: '1rem' }}
                    {...register('profile.city', { required: true })}
                    isOptionEqualToValue={
                      (option, value) =>  option.name === value?.name
                    }
                    onChange={(_, newValue: ICity | null) => {
                      onChange(newValue)
                    }}
                    renderInput={
                      (params) =>
                        <TextField
                          {...params}
                          label="City"
                        />
                    }
                  />
                }}
              />
              {
                <FormGroup>
                  <RadioGroup
                    name="controlled-radio-buttons-group"
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <FormControlLabel
                      value="license"
                      control={<Radio />}
                      label="By license agreement"
                      onClick={() => setValue('mutual', false)}
                      {...register('license')}
                    />
                    <FormControlLabel
                      value="mutual"
                      control={<Radio />}
                      label="By mutual agreement"
                      onClick={() => {
                        setValue('license', false);
                        setValue('accept', false)
                      }}
                      {...register('mutual')}
                    />
                  </RadioGroup>
                </FormGroup>
              }

              <FormGroup sx={{ marginTop: '-1.25rem', marginBottom: '1.5rem' }}>
                {(license && !mutual) &&
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox name="accept"  />
                      }
                      sx={errors.accept &&  { color: 'red' }}
                      label="I accept the terms of the license agreement *"
                      {...register('accept', { required: !!license })}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox name="updates" />
                      }
                      label="Send me updates by email"
                      {...register('newsletters', {})}
                    />
                  </>
                }
                {(mutual && !license) &&
                  <FormControlLabel
                    control={
                      <Checkbox name="updates" />
                    }
                    label="Send me updates by email"
                    {...register('newsletters', {})}
                  />
                }
              </FormGroup>
              <FormGroup sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Button
                  type="submit"
                  disabled={!isEditing && isButtonDisabled()}
                >
                  {isEditing ? 'Update record' : 'Create record'}
                </Button>
                {
                  isEditing &&
                  <Button
                    type="button"
                    sx={{ backgroundColor: 'red' }}
                    onClick={handleDelete}
                  >
                    Delete record
                  </Button>
                }
              </FormGroup>
            </form>
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
          </>
      }
    </Container>
  );
}