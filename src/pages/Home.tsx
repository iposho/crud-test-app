import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllRecordsQuery } from '../store/api/server.api.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import Table from '../components/layout/Table.tsx';

export default function Home() {
  const { isLoading, isError, data, refetch } = useGetAllRecordsQuery('');
  const { deleteRecord } = useDeleteRecord();

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.id) {
      refetch();
      location.state = null;
    }
  }, [location, refetch])

  const handleDeleteRecord = async (recordId: number) => {
    try {
      await deleteRecord(recordId);
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      { isError && <h1 className="text-red">Something went wrong...</h1> }
      <div className="flex items-start flex-col px-4 w-full">
        { isLoading && <h1 className="text-red">Loading...</h1> }
        {
          data &&
          <Table
            data={data}
            onDeleteRecord={handleDeleteRecord}
            refetch={refetch}
          />
        }
      </div>
    </>
  )
}