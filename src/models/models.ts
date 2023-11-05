export type Records = IRecord[]

export interface ICreateRecordRequest {
  data: object; // Данные для обновления записи
}
export interface IUpdateRecordRequest {
  id: string; // ID записи
  data: object; // Данные для обновления записи
}

export interface IUpdateRecordResponse {
  success: boolean; // Поле, указывающее на успешное обновление
  message?: string; // Опциональное поле с сообщением об ошибке
  // Другие поля, если они возвращаются вашим сервером
}

export interface IRecord {
  id: string
  email: string
  profile: IProfile
  createdAt: string
  updatedAt: string
}

export interface IProfile {
  name: string
  country: string
  state: string
}
