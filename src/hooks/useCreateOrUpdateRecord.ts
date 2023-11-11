/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateRecordMutation, useUpdateRecordMutation } from '../store/api/server.api';
import { IRecord } from '../models/models';

interface CreateOrUpdateRecordData {
  createRecord: (formData: IRecord) => Promise<any>;
  updateRecord: (id: number, formData: IRecord) => Promise<any>;
}

const useCreateOrUpdateRecord = (): CreateOrUpdateRecordData => {
  const [createRecordMutation] = useCreateRecordMutation();
  const [updateRecordMutation] = useUpdateRecordMutation();

  const createRecord = async (formData: IRecord) => {
    const recordData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return createRecordMutation({
      data: recordData,
    });
  };

  const updateRecord = async (id: number, formData: IRecord) => {
    const recordData = {
      ...formData,
      updatedAt: new Date(),
    };

    return updateRecordMutation({
      id,
      data: recordData,
    });
  };

  return { createRecord, updateRecord };
};
/* eslint-enable @typescript-eslint/no-explicit-any */
export default useCreateOrUpdateRecord;
