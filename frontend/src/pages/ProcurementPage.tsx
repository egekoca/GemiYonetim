import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ShoppingCart, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function ProcurementPage() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['procurement', 'requests'],
    queryFn: async () => {
      const response = await api.get('/procurement/requests');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ORDERED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {requests?.map((request: any) => (
            <li key={request.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.requestNumber} | {request.vessel?.name} | Gerekli: {formatDate(request.requiredDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {request.estimatedCost && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${request.estimatedCost.toLocaleString()}
                      </div>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
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

