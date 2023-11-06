import { useDeleteRecordMutation } from '../store/api/server.api.ts';

type DeleteRecordData = {
  deleteRecord: (id: string) => Promise<void>;
};

const useDeleteRecord = (): DeleteRecordData => {
  const [deleteRecordMutation] = useDeleteRecordMutation();

  const deleteRecord = async (id: string) => {
    if (id) {
      try {
        const response = await deleteRecordMutation(id);

        if ('error' in response) {
          console.log('Запись успешно удалена');
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса', error);
      }
    }
  };

  return { deleteRecord };
};

export default useDeleteRecord;
