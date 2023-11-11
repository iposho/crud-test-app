import { useDeleteRecordMutation } from '../store/api/server.api';

type DeleteRecordData = {
  deleteRecord: (id: number) => Promise<void>;
};

const useDeleteRecord = (): DeleteRecordData => {
  const [deleteRecordMutation] = useDeleteRecordMutation();

  const deleteRecord = async (id: number) => {
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
