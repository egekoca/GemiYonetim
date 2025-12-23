import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ClipboardList, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function WorkOrdersPage() {
  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['maintenance', 'work-orders'],
    queryFn: async () => {
      const response = await api.get('/maintenance/work-orders');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'CLOSED':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <ClipboardList className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {workOrders?.map((wo: any) => (
            <li key={wo.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(wo.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {wo.workOrderNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {wo.task?.title} | {wo.task?.vessel?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Start: {formatDate(wo.startDate)}
                        {wo.completedDate && ` | End: ${formatDate(wo.completedDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {wo.totalCost && (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${wo.totalCost.toLocaleString()}
                      </p>
                    )}
                    {wo.actualHours && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wo.actualHours} hours
                    </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{wo.status}</p>
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

