import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Records } from '../../models/models.ts';

interface TableProps {
  data: Records;
}

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
    valueGetter: (params) => params.row.profile.city.name
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
      <Link to={`/records/${params.row.id}`}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'red' }}
        >
          Delete
        </Button>
      </Link>
    ),
  },
];


export default function Table({ data }: TableProps) {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={!data}
        initialState={{
          sorting: {
            sortModel: [{ field: 'id', sort: 'desc' }],
          },
        }}
      />
    </div>
  );
}