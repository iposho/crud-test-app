export type Records = IRecord[]

export interface ICreateRecordRequest {
  data: object;
}
export interface IUpdateRecordRequest {
  id: number;
  data: object;
}

export interface IUpdateRecordResponse {
  success: boolean;
  message?: string;
}

export interface IRecord {
  id: number
  email: string
  profile: IProfile
  createdAt: string
  updatedAt: string
}
export interface IProfile {
  city?: ICity | null
  name: string
  state: IState
  country: ICountry
}

export interface ICity {
  name: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  stateCode: string
  countryCode: string
}

export interface IState {
  name: string
  isoCode: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  countryCode: string
}

export interface ICountry {
  flag: string
  name: string
  isoCode: string
  currency: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  phonecode: string
  timezones?: ITimezone[] | undefined
}

export interface ITimezone {
  tzName: string
  zoneName: string
  gmtOffset: number
  abbreviation: string
  gmtOffsetName: string
}

