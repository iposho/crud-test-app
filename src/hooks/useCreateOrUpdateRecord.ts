import { useCreateRecordMutation, useUpdateRecordMutation } from '../store/api/server.api.ts';
import { IRecord } from '../models/models.ts';

type CreateOrUpdateRecordData = {
  createRecord: (formData: IRecord) => Promise<void>;
  updateRecord: (id: string, formData: IRecord) => Promise<void>;
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

    const response = await createRecordMutation({
      data: recordData,
    });

    if ('error' in response) {
      console.error('Ошибка при создании записи', response.error);
    } else {
      console.log('Запись успешно создана', response.data);
    }
  };

  const updateRecord = async (id: string, formData: IRecord) => {
    console.log(formData);

    const recordData = {
      ...formData,
      updatedAt: new Date(),
    };

    try {
      const response = await updateRecordMutation({
        id,
        data: recordData,
      });

      if ('error' in response) {
        console.error('Ошибка при обновлении записи', response.error);
      } else {
        console.log('Запись успешно обновлена', response.data);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса', error);
    }
  };

  return { createRecord, updateRecord };
};

export default useCreateOrUpdateRecord;