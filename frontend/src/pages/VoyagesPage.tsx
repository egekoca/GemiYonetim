import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Ship, MapPin, DollarSign } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function VoyagesPage() {
  const { data: voyages, isLoading } = useQuery({
    queryKey: ['voyages'],
    queryFn: async () => {
      const response = await api.get('/voyages');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PLANNED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {voyages?.map((voyage: any) => (
            <li key={voyage.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {voyage.voyageNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {voyage.vessel?.name} | {voyage.originPort || 'N/A'} → {voyage.destinationPort || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Başlangıç: {formatDate(voyage.startDate)}
                        {voyage.endDate && ` | Bitiş: ${formatDate(voyage.endDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {voyage.totalExpenses && (
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {voyage.totalExpenses.toLocaleString()}
                        </div>
                      </div>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(voyage.status)}`}>
                      {voyage.status}
                    </span>
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

