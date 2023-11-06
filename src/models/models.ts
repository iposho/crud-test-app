export type Records = IRecord[]

export interface ICreateRecordRequest {
  data: object;
}
export interface IUpdateRecordRequest {
  id: string;
  data: object;
}

export interface IUpdateRecordResponse {
  success: boolean;
  message?: string;
}

export interface IRecord {
  id: string
  email: string
  profile: IProfile
  createdAt: string
  updatedAt: string
}
export interface IProfile {
  city: City
  name: string
  state: State
  country: Country
}

export interface City {
  name: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  stateCode: string
  countryCode: string
}

export interface State {
  name: string
  isoCode: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  countryCode: string
}

export interface Country {
  flag: string
  name: string
  isoCode: string
  currency: string
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  phonecode: string
  timezones?: Timezone[] | undefined
}

export interface Timezone {
  tzName: string
  zoneName: string
  gmtOffset: number
  abbreviation: string
  gmtOffsetName: string
}

