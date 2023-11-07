import { useState, useEffect, MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom';
import { Records } from '../../models/models.ts';

import formatISODate from '../../helpers/formatDate.ts';
import Modal from '../ui/Modal.tsx';

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
  const state = location.state;

  useEffect(() => {
    if (state) {
      setHighlightedRowId(state.id)
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
    { field: 'email', headerName: 'Email', width: 250, flex: .5 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: .5,
      valueGetter: (params) => params.row.profile.name
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 130,
      flex: .5,
      valueGetter: (params) => params.row.profile.country.name
    },
    {
      field: 'state',
      headerName: 'State',
      width: 130,
      flex: .5,
      valueGetter: (params) => params.row.profile.state.name
    },
    {
      field: 'city',
      headerName: 'City',
      width: 130,
      flex: .5,
      valueGetter: (params) => params.row.profile.city?.name
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 130,
      flex: .5,
      valueGetter: (params) => formatISODate(params.row.updatedAt)
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
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={data}
        getRowClassName={(params) =>
          params.row.id === highlightedRowId ? 'highLigthedRow' : ''
        }
        columns={columns}
        loading={!data}
        onRowClick={(params) => {
          if (params.row.id === highlightedRowId) {
            setHighlightedRowId(null);
          }
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
        isDeleting={true}
        onDelete={handleDelete}
        message={`Deleting record with id ${recordIdToDelete}`}
      />
    </div>
  );
}