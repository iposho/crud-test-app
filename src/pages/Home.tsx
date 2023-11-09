import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllRecordsQuery } from '../store/api/server.api.ts';
import useDeleteRecord from '../hooks/useDeleteRecord.ts';

import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Table from '../components/layout/Table.tsx';
import Container from '@mui/material/Container';

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
    <Container
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      maxWidth={false}
    >
      { isError &&
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Something went wrong
        </Alert> }
      { isLoading && <CircularProgress size={60} /> }
      {
        data &&
        <Table
          data={data}
          onDeleteRecord={handleDeleteRecord}
          refetch={refetch}
        />
      }
    </Container>
  )
}