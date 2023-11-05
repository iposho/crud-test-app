import { useGetAllRecordsQuery } from '../store/api/server.api.ts';
import { Link } from 'react-router-dom';

export default function Home() {
  const { isLoading, isError, data } = useGetAllRecordsQuery('');

  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
      { isError && <h1 className="text-red">Something went wrong...</h1> }
      <div className="flex items-start flex-col w-[80%]">
        { isLoading && <h1 className="text-red">Loading...</h1> }
        {
          data?.map(i =>
            <Link
              to={`records/${i.id}`}
              className="flex py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
              key={i.id}
            >
              {i.id}
            </Link>)
        }
      </div>
    </div>
  )
}