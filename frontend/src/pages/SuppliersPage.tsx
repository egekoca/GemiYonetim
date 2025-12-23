import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['procurement', 'suppliers'],
    queryFn: async () => {
      const response = await api.get('/procurement/suppliers');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers?.map((supplier: any) => (
          <div
            key={supplier.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {supplier.name}
              </h3>
            </div>
            {supplier.contactPerson && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Contact: {supplier.contactPerson}
              </p>
            )}
            {supplier.email && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Mail className="h-4 w-4 mr-2" />
                {supplier.email}
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Phone className="h-4 w-4 mr-2" />
                {supplier.phone}
              </div>
            )}
            {supplier.website && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Globe className="h-4 w-4 mr-2" />
                {supplier.website}
              </div>
            )}
            {supplier.city && supplier.country && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {supplier.city}, {supplier.country}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

