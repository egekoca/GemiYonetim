import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Ship } from 'lucide-react';

export default function VesselsPage() {
  const { data: vessels, isLoading } = useQuery({
    queryKey: ['vessels'],
    queryFn: async () => {
      const response = await api.get('/vessels');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {vessels?.map((vessel: any) => (
            <li key={vessel.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {vessel.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        IMO: {vessel.imoNumber} | {vessel.vesselType} | {vessel.flag}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {vessel.documents?.length || 0} doküman
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

