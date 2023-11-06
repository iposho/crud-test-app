import { useState } from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingFn,
  SortingState
} from '@tanstack/react-table'

import { IRecord, Records } from '../../models/models.ts';

const columnHelper = createColumnHelper<IRecord>()

const countrySort: SortingFn<any> = (rowA, rowB) => {
  const countryA:string = rowA.getValue('profile_country');
  const countryB:string = rowB.getValue('profile_country');
  const regionA:string = rowA.getValue('profile_state');
  const regionB:string = rowB.getValue('profile_country');

  if (countryA === countryB) {
    return regionA.localeCompare(regionB);
  }

  return countryA.localeCompare(countryB);
}

const columns= [
  columnHelper.accessor('id', {
    header: () => 'ID',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('email', {
    header: () => 'Email',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('profile.name', {
    header: () => 'Name',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('profile.country', {
    header: () => 'Country',
    cell: info => info.getValue(),
    footer: info => info.column.id,
    sortingFn: countrySort,
  }),
  columnHelper.accessor('profile.state', {
    header: () => 'State',
    cell: info => info.getValue(),
    footer: info => info.column.id,
    sortingFn: countrySort,
  }),
]



function Table(data: Records) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    ...data,
    columns: columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table