import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  TextField,
  Button,
  Radio,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Container,
  FormGroup
} from '@mui/material';
import * as Yup from 'yup';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';

interface FormValues {
  profile: {
    name: string;
    phone: string;
    country: ICountry | null;
    state: IState | null;
    city: ICity | null;
  };
  email: string;
  emailConfirm: string;
  radioOption: string;
  licenseAgreement: boolean;
  newsCheckbox: boolean;
}

// const validationSchema = Yup.object().shape<FormValues>({
//   profile: Yup.object().shape({
//     name: Yup.string().required('Обязательное поле'),
//     phone: Yup.string().required('Обязательное поле'),
//     country: Yup.object().required('Обязательное поле'),
//     state: Yup.object().when('profile.country', {
//       is: (country) => country && country.id !== '',
//       then: Yup.object().required('Обязательное поле'),
//     }),
//     city: Yup.object().when(['profile.country', 'profile.state'], {
//       is: (country, state) => country && country.id !== '' && state && state.id !== '',
//       then: Yup.object().required('Обязательное поле'),
//     }),
//   }),
//   email: Yup.string().email('Некорректный email').required('Обязательное поле'),
//   emailConfirm: Yup.string()
//     .oneOf([Yup.ref('email'), null], 'Email не совпадает')
//     .required('Обязательное поле'),
//   radioOption: Yup.string().required('Обязательное поле'),
//   licenseAgreement: Yup.boolean().when('radioOption', {
//     is: 'licenseAgreement',
//     then: Yup.boolean().oneOf([true], 'Обязательное поле'),
//   }),
//   newsCheckbox: Yup.boolean(),
// });

const Signup: React.FC = () => {
  const countries = Country.getAllCountries();

  const handleCountryChange = (
    event: React.ChangeEvent<{}>,
    newValue: ICountry | null,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  ) => {
    setFieldValue('profile.country', newValue);
    setFieldValue('profile.state', null);
    setFieldValue('profile.city', null);
    setFieldTouched('profile.country', true);
  };

  const handleStateChange = (
    newValue: IState | null,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  ) => {
    setFieldValue('profile.state', newValue);
    setFieldValue('profile.city', null);
    setFieldTouched('profile.state', true);
    setFieldTouched('profile.city', true);  // Устанавливаем touched для города
  };

  const handleCityChange = (
    newValue: ICity | null,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  ) => {
    setFieldValue('profile.city', newValue);
    setFieldTouched('profile.city', true);  // Устанавливаем touched для города
  };

  const handleSubmit = (values: FormValues) => {
    // Обработка отправки формы
    console.log(values);
  };

  return (
    <Formik
      initialValues={{
        profile: {
          name: '',
          phone: '',
          country: null,
          state: null,
          city: null,
        },
        email: '',
        emailConfirm: '',
        radioOption: '',
        licenseAgreement: false,
        newsCheckbox: false,
      }}
      // validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        errors,
        touched }) => (
        <Container>
          <Form>
            <h1>Create record</h1>
            {/* Имя */}
            <Field
              as={TextField}
              type="text"
              label="Имя"
              name="profile.name"
              onChange={handleChange}
              value={values.profile.name}
              error={touched.profile?.name && Boolean(errors.profile?.name)}
              helperText={touched.profile?.name && errors.profile?.name}
              fullWidth
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Номер телефона */}
            <Field
              as={TextField}
              type="tel"
              label="Номер телефона"
              name="profile.phone"
              onChange={handleChange}
              value={values.profile.phone}
              error={touched.profile?.phone && Boolean(errors.profile?.phone)}
              helperText={touched.profile?.phone && errors.profile?.phone}
              fullWidth
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Email */}
            <Field
              as={TextField}
              type="email"
              label="Email"
              name="email"
              onChange={handleChange}
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Email Confirm */}
            <Field
              as={TextField}
              type="email"
              label="Email Confirm"
              name="emailConfirm"
              onChange={handleChange}
              value={values.emailConfirm}
              error={touched.emailConfirm && Boolean(errors.emailConfirm)}
              helperText={touched.emailConfirm && errors.emailConfirm}
              fullWidth
              disabled={!values.email}
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Страна */}
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => handleCountryChange(event, newValue, setFieldValue, setFieldTouched)}
              value={values.profile.country}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Страна"
                  error={touched.profile?.country && Boolean(errors.profile?.country)}
                  helperText={touched.profile?.country && errors.profile?.country}
                />
              )}
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Список штатов */}
            <Autocomplete
              options={values.profile.country ? State.getStatesOfCountry(values.profile.country.isoCode) : []}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => handleStateChange(newValue, setFieldValue, setFieldTouched)}
              value={values.profile.state}
              disabled={!values.profile.country}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Штат"
                  error={touched.profile?.state && Boolean(errors.profile?.state)}
                  helperText={touched.profile?.state && errors.profile?.state}
                />
              )}
              sx={{
                marginBottom: '1rem'
              }}
            />

            {/* Список городов */}
            <Autocomplete
              options={values.profile.state ? City.getCitiesOfState(values.profile.country.isoCode, values.profile.state.isoCode) : []}
              getOptionLabel={(option) => option.name}
              value={values.profile.city}
              onChange={(e, newValue) => handleCityChange(newValue, setFieldValue, setFieldTouched)}
              disabled={!values.profile.state}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Город"
                  error={touched.profile?.city && Boolean(errors.profile?.city)}
                  helperText={touched.profile?.city && errors.profile?.city}
                />
              )}
              sx={{
                marginBottom: '1rem'
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Radio
                    name="radioOption"
                    value="licenseAgreement"
                    onChange={handleChange}
                    checked={values.radioOption === 'licenseAgreement'}
                  />
                }
                label="По лицензионному соглашению"
              />

              <FormControlLabel
                control={
                  <Radio
                    name="radioOption"
                    value="mutualAgreement"
                    onChange={handleChange}
                    checked={values.radioOption === 'mutualAgreement'}
                  />
                }
                label="По обоюдному согласию"
              />
            </FormGroup>

            {/* Радиобатон */}


            {/* Блок с чекбоксами */}
            {values.radioOption === 'licenseAgreement' && (
              <Container>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="licenseAgreement"
                      checked={values.licenseAgreement}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Принимаю условия лицензионного соглашения"
                />
                <ErrorMessage name="profile.licenseAgreement" component="div" />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="newsCheckbox"
                      checked={values.newsCheckbox}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Отправлять мне новости по email"
                />
              </Container>
            )}

            {values.radioOption === 'mutualAgreement' && (
              <FormControlLabel
                control={
                  <Checkbox
                    name="newsCheckbox"
                    checked={values.newsCheckbox}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Отправлять мне новости по email"
              />
            )}

            {/* Кнопка создания / редактирования */}
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || Object.keys(errors).length > 0}>
              Создать/Редактировать
            </Button>
          </Form>
        </Container>
      )}
    </Formik>
  );
};

export default Signup;
