const initialData = {
  id: NaN,
  email: '',
  profile: {
    name: '',
    phone: '',
    country: {
      name: '',
      isoCode: '',
      flag: '',
      phonecode: '',
      currency: '',
      latitude: '',
      longitude: '',
      timezones: [
        {
          zoneName: '',
          gmtOffset: 0,
          gmtOffsetName: '',
          abbreviation: '',
          tzName: '',
        },
      ],
    },
    state: {
      name: '',
      isoCode: '',
      countryCode: '',
      latitude: '',
      longitude: '',
    },
    city: {
      name: '',
      countryCode: '',
      stateCode: '',
      latitude: '',
      longitude: '',
    },
  },
  license: true,
  mutual: false,
  accept: true,
  updates: false,
  createdAt: '',
  updatedAt: '',
};

export default initialData;
