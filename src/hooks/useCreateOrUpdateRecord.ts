import { useCreateRecordMutation, useUpdateRecordMutation } from '../store/api/server.api.ts';
import { IRecord } from '../models/models.ts';

type CreateOrUpdateRecordData = {
  createRecord: (formData: IRecord) => Promise<any>;
  updateRecord: (id: number, formData: IRecord) => Promise<any>;
};

const useCreateOrUpdateRecord = (): CreateOrUpdateRecordData => {
  const [createRecordMutation] = useCreateRecordMutation();
  const [updateRecordMutation] = useUpdateRecordMutation();

  const createRecord = async (formData: IRecord) => {
    const recordData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await createRecordMutation({
      data: recordData,
    });
  };

  const updateRecord = async (id: number, formData: IRecord) => {
    const recordData = {
      ...formData,
      updatedAt: new Date(),
    };

    return await updateRecordMutation({
      id,
      data: recordData,
    });
  };

  return { createRecord, updateRecord };
};

export default useCreateOrUpdateRecord;