import { useState, useEffect, MouseEvent } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Box';
import Button from '@mui/material/Button';

import Modal from '../ui/Modal';

import { Records } from '../../models/models';

import formatISODate from '../../helpers/formatDate';

interface TableProps {
  data: Records;
  onDeleteRecord: (recordId: number) => Promise<void>;
  refetch: () => void;
}

export default function Table({ data, onDeleteRecord, refetch }: TableProps) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);

  const handleOpenDeleteModal = (recordId: number) => {
    setRecordIdToDelete(recordId);
    setDeleteModalOpen(true);
  };

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.id) {
      setHighlightedRowId(state.id);
    }
  }, [state]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const isClickInsideDataGrid = (e.target as HTMLElement).closest('.MuiDataGrid-root');
      if (!isClickInsideDataGrid) {
        setHighlightedRowId(null); // Убрать подсветку
      }
    };

    document.body.addEventListener('click', handleClick as unknown as EventListener);

    return () => {
      document.body.removeEventListener('click', handleClick as unknown as EventListener);
    };
  }, []);

  const handleDelete = async () => {
    if (recordIdToDelete) {
      await onDeleteRecord(recordIdToDelete);
      await refetch();
      setDeleteModalOpen(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'email', headerName: 'Email', width: 250, flex: 0.5,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 0.5,
      valueGetter: (params) => params.row.profile.name,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 200,
      flex: 0.5,
      valueGetter: (params) => params.row.profile.phone,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 130,
      flex: 0.5,
      valueGetter: (params) => params.row.profile.country.name,
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    {
      field: 'state',
      headerName: 'State',
      width: 130,
      flex: 0.5,
      valueGetter: (params) => params.row.profile.state?.name,
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    {
      field: 'city',
      headerName: 'City',
      width: 130,
      flex: 0.5,
      valueGetter: (params) => params.row.profile.city?.name,
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 130,
      flex: 0.5,
      valueGetter: (params) => formatISODate(params.row.updatedAt),
    },
    {
      field: 'Edit Link',
      headerName: '',
      width: 80,
      renderCell: (params) => (
        <Link to={`/records/${params.row.id}`}>
          <Button variant="contained">Edit</Button>
        </Link>
      ),
    },
    {
      field: 'Delete Link',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: 'red' }}
          onClick={() => handleOpenDeleteModal(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container style={{ width: '100vw', marginTop: '1rem' }}>
      <DataGrid
        rows={data}
        getRowClassName={(params) => (params.row.id === highlightedRowId ? 'highLigthedRow' : '')}
        columns={columns}
        loading={!data}
        onRowClick={() => {
          setHighlightedRowId(null);
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'updatedAt', sort: 'desc' }],
          },
        }}
      />
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        id={recordIdToDelete}
        isDeleting
        onDelete={handleDelete}
        message={`Deleting record with id ${recordIdToDelete}`}
      />
    </Container>
  );
}
