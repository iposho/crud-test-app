import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Records,
  IRecord,
  IUpdateRecordRequest,
  IUpdateRecordResponse, ICreateRecordRequest
} from '../../models/models.ts';

export const serverApi = createApi({
  reducerPath: 'server/api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5100'
  }),
  endpoints: build => ({
    getAllRecords: build.query<Records, string>({
      query: () => 'records'
    }),
    getRecordById: build.query<IRecord, string>({
      query: (id) => ({
        url: 'records',
        params: {
          id,
        }
      })
    }),
    createRecord: build.mutation<ICreateRecordRequest, ICreateRecordRequest>({
      query: (newRecord) => ({
        url: 'records',
        method: 'POST',
        body: newRecord.data,
      }),
    }),
    updateRecord: build.mutation<IUpdateRecordResponse, IUpdateRecordRequest>({
      query: (updates) => ({
        url: `records/${updates.id}`,
        method: 'PUT',
        body: updates.data,
      }),
    }),
    deleteRecord: build.mutation<void, string>({
      query: (id) => ({
        url: `records/${id}`, // Путь для удаления записи
        method: 'DELETE', // Метод HTTP для удаления
      }),
    }),
  })
})

export const {
  useGetAllRecordsQuery,
  useGetRecordByIdQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation
} = serverApi;