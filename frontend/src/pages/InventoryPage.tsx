import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function InventoryPage() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['inventory', 'items'],
    queryFn: async () => {
      console.log('InventoryPage: Fetching inventory items');
      const response = await api.get('/inventory/items');
      console.log('InventoryPage: Received response', response.data);
      return response.data;
    },
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const response = await api.get('/inventory/items/low-stock');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  if (error) {
    console.error('InventoryPage error:', error);
    return <div className="text-center py-12 text-red-600">Hata: {String(error)}</div>;
  }

  return (
    <div className="p-6">
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Düşük Stok Uyarısı ({lowStockItems.length} kalem)
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
            {lowStockItems.slice(0, 5).map((item: any) => (
              <li key={item.id}>
                {item.name} - Mevcut: {item.quantity} {item.unit} | Minimum: {item.minimumQuantity}{' '}
                {item.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {!items || items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Envanter bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Henüz envanter kaydı eklenmemiş.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item: any) => {
            const isLowStock =
              item.minimumQuantity && item.quantity <= item.minimumQuantity;
            const isExpiring =
              item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            return (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.vessel?.name} | {item.location?.name || 'Konum belirtilmemiş'} |{' '}
                          {item.partNumber || 'Parça No: N/A'}
                        </p>
                        {item.expiryDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Son kullanma: {formatDate(item.expiryDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.quantity} {item.unit}
                        </p>
                        {item.minimumQuantity && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Min: {item.minimumQuantity} {item.unit}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {isLowStock && (
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                        {isExpiring && (
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        {!isLowStock && !isExpiring && (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        )}
      </div>
    </div>
  );
}

