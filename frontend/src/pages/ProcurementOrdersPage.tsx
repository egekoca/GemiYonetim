import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function ProcurementOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['procurement', 'orders'],
    queryFn: async () => {
      const response = await api.get('/procurement/orders');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'RECEIVED':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'ORDERED':
      case 'APPROVED':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {orders?.map((order: any) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.supplier?.name} | {order.request?.title} | {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.totalAmount?.toLocaleString()} {order.currency || 'USD'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.status}</p>
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

