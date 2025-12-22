import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ArrowUp, ArrowDown, RefreshCw, Package } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function InventoryTransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['inventory', 'transactions'],
    queryFn: async () => {
      const response = await api.get('/inventory/transactions');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <ArrowDown className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'OUT':
        return <ArrowUp className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'TRANSFER':
        return <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'ADJUSTMENT':
        return <Package className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'IN':
        return 'Giriş';
      case 'OUT':
        return 'Çıkış';
      case 'TRANSFER':
        return 'Transfer';
      case 'ADJUSTMENT':
        return 'Düzeltme';
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'IN':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'OUT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TRANSFER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ADJUSTMENT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions?.map((transaction: any) => (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.transactionType)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.item?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.item?.vessel?.name} | {transaction.reference || 'Referans yok'}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.quantity} {transaction.item?.unit}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                      {transaction.createdBy && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.createdBy.firstName} {transaction.createdBy.lastName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getTransactionTypeColor(
                        transaction.transactionType,
                      )}`}
                    >
                      {getTransactionTypeLabel(transaction.transactionType)}
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

