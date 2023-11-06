import { useGetAllRecordsQuery } from '../store/api/server.api.ts';

import Layout from '../components/layout/Layout.tsx';
import Table from '../components/layout/Table.tsx';

export default function Home() {
  const { isLoading, isError, data } = useGetAllRecordsQuery('');

  return (
    <Layout>
      { isError && <h1 className="text-red">Something went wrong...</h1> }
      <div className="flex items-start flex-col px-4 w-full">
        { isLoading && <h1 className="text-red">Loading...</h1> }
        { data && <Table data={data} />}
      </div>
    </Layout>
  )
}